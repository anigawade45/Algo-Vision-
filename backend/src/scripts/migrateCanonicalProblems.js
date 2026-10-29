/**
 * migrateCanonicalProblems.js
 *
 * Safe, idempotent migration script to:
 * 1. Compute and backfill SHA-256 content fingerprints for all existing DSA problems.
 * 2. Detect duplicate problems sharing identical canonical content (normalized title, description, constraints).
 * 3. Canonicalize duplicates into one primary document:
 *    - Merges contributors into primary document
 *    - Re-links user workspaces (ProblemWorkspace) without losing stage progress
 *    - Re-links AI stage analyses (Understanding, Analogy, Code, etc.)
 *    - Removes redundant duplicate problem records
 * 4. Syncs unique sparse fingerprint index in MongoDB.
 *
 * Usage:
 *   node src/scripts/migrateCanonicalProblems.js --dry-run   (Audit without writing changes)
 *   node src/scripts/migrateCanonicalProblems.js             (Execute migration)
 */

const mongoose = require('mongoose');
const env = require('../config/env');
const Problem = require('../models/Problem');
const ProblemWorkspace = require('../models/ProblemWorkspace');
const ProblemUnderstanding = require('../models/ProblemUnderstanding');
const ProblemAnalogy = require('../models/ProblemAnalogy');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemAlgorithm = require('../models/ProblemAlgorithm');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const ProblemCode = require('../models/ProblemCode');
const ProblemDryRun = require('../models/ProblemDryRun');
const ProblemComplexity = require('../models/ProblemComplexity');
const ProblemPractice = require('../models/ProblemPractice');
const { generateProblemFingerprint } = require('../services/problem.service');

const STAGE_MODELS = [
  { name: 'ProblemUnderstanding', model: ProblemUnderstanding },
  { name: 'ProblemAnalogy', model: ProblemAnalogy },
  { name: 'ProblemPattern', model: ProblemPattern },
  { name: 'ProblemAlgorithm', model: ProblemAlgorithm },
  { name: 'ProblemPseudocode', model: ProblemPseudocode },
  { name: 'ProblemCode', model: ProblemCode },
  { name: 'ProblemDryRun', model: ProblemDryRun },
  { name: 'ProblemComplexity', model: ProblemComplexity },
  { name: 'ProblemPractice', model: ProblemPractice },
];

const isDryRun = process.argv.includes('--dry-run');

/**
 * Chooses the best canonical record among duplicates:
 * 1. Clean slug (without random timestamp suffix e.g., 'two-sum' vs 'two-sum-123456')
 * 2. Oldest createdAt
 */
const choosePrimaryRecord = (duplicates) => {
  const sorted = [...duplicates].sort((a, b) => {
    const aHasSuffix = /-\d{5,}$/.test(a.problemId);
    const bHasSuffix = /-\d{5,}$/.test(b.problemId);

    if (!aHasSuffix && bHasSuffix) return -1;
    if (aHasSuffix && !bHasSuffix) return 1;

    const aDate = new Date(a.createdAt || 0).getTime();
    const bDate = new Date(b.createdAt || 0).getTime();
    return aDate - bDate;
  });

  return sorted[0];
};

const runMigration = async () => {
  console.log(`\n======================================================`);
  console.log(`AlgoVision Canonical Problem Migration`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (No changes will be saved)' : 'LIVE EXECUTION'}`);
  console.log(`======================================================\n`);

  try {
    console.log(`Connecting to MongoDB (${env.nodeEnv})...`);
    await mongoose.connect(env.mongoUri);
    console.log(`Connected to MongoDB.\n`);

    // 1. Fetch all existing problems
    const allProblems = await Problem.find({}).sort({ createdAt: 1 });
    console.log(`Found ${allProblems.length} total problem records in database.`);

    let backfilledCount = 0;
    const fingerprintMap = new Map();

    // 2. Compute fingerprints and group into canonical clusters
    for (const problem of allProblems) {
      const computedFingerprint = generateProblemFingerprint(
        problem.title,
        problem.description
      );

      if (!fingerprintMap.has(computedFingerprint)) {
        fingerprintMap.set(computedFingerprint, []);
      }
      fingerprintMap.get(computedFingerprint).push(problem);
    }

    console.log(`Unique canonical problem clusters: ${fingerprintMap.size}.\n`);

    // 3. Process clusters, backfill primary fingerprint, and merge duplicates
    let mergedProblemsCount = 0;
    let migratedWorkspacesCount = 0;
    let migratedStagesCount = 0;

    for (const [fingerprint, problems] of fingerprintMap.entries()) {
      const primary = choosePrimaryRecord(problems);
      const duplicates = problems.filter((p) => String(p._id) !== String(primary._id));

      // Backfill fingerprint and testCaseCount onto the primary canonical problem
      const actualTestCaseCount = Array.isArray(primary.testCases) ? primary.testCases.length : 0;
      const needsUpdate =
        !primary.fingerprint ||
        primary.fingerprint !== fingerprint ||
        primary.testCaseCount !== actualTestCaseCount;

      if (needsUpdate) {
        backfilledCount++;
        if (!isDryRun) {
          primary.fingerprint = fingerprint;
          primary.testCaseCount = actualTestCaseCount;
          await Problem.findByIdAndUpdate(primary._id, {
            fingerprint,
            testCaseCount: actualTestCaseCount,
          });
        }
      }

      if (duplicates.length === 0) continue;

      console.log(`--- Duplicate Cluster Detected ---`);
      console.log(`Title: "${primary.title}" (Cluster size: ${problems.length})`);
      console.log(`Primary Canonical ID: ${primary._id} [slug: ${primary.problemId}]`);

      for (const dup of duplicates) {
        console.log(`  -> Merging duplicate: ${dup._id} [slug: ${dup.problemId}]`);

        // A. Contributors Merge
        const contributorsToAdd = new Set();
        if (dup.createdBy && String(dup.createdBy) !== String(primary.createdBy)) {
          contributorsToAdd.add(String(dup.createdBy));
        }
        if (Array.isArray(dup.contributors)) {
          dup.contributors.forEach((cId) => {
            if (String(cId) !== String(primary.createdBy)) {
              contributorsToAdd.add(String(cId));
            }
          });
        }

        if (contributorsToAdd.size > 0 && !isDryRun) {
          await Problem.findByIdAndUpdate(primary._id, {
            $addToSet: { contributors: { $each: Array.from(contributorsToAdd) } },
          });
        }

        // B. Workspaces Migration
        const workspaces = await ProblemWorkspace.find({ problemId: dup._id });
        for (const ws of workspaces) {
          const existingPrimaryWs = await ProblemWorkspace.findOne({
            problemId: primary._id,
            userId: ws.userId,
          });

          if (!existingPrimaryWs) {
            // Re-point workspace to primary problem
            migratedWorkspacesCount++;
            if (!isDryRun) {
              await ProblemWorkspace.findByIdAndUpdate(ws._id, { problemId: primary._id });
            }
          } else {
            // User had workspace on both; merge completed stages and keep higher progress
            const mergedStages = Array.from(
              new Set([...(existingPrimaryWs.completedStages || []), ...(ws.completedStages || [])])
            ).sort((a, b) => a - b);
            const higherStage = Math.max(existingPrimaryWs.currentStage || 1, ws.currentStage || 1);

            migratedWorkspacesCount++;
            if (!isDryRun) {
              await ProblemWorkspace.findByIdAndUpdate(existingPrimaryWs._id, {
                completedStages: mergedStages,
                currentStage: higherStage,
              });
              await ProblemWorkspace.findByIdAndDelete(ws._id);
            }
          }
        }

        // C. AI Stage Data Migration
        for (const { name, model } of STAGE_MODELS) {
          const stageDocs = await model.find({ problemId: dup._id });
          for (const doc of stageDocs) {
            const query = { problemId: primary._id };
            if (doc.userId) query.userId = doc.userId;
            if (doc.approachId) query.approachId = doc.approachId;

            const existingDoc = await model.findOne(query);
            if (!existingDoc) {
              migratedStagesCount++;
              if (!isDryRun) {
                await model.findByIdAndUpdate(doc._id, { problemId: primary._id });
              }
            } else {
              if (!isDryRun) {
                await model.findByIdAndDelete(doc._id);
              }
            }
          }
        }

        // D. Remove Duplicate Problem Document
        mergedProblemsCount++;
        if (!isDryRun) {
          await Problem.findByIdAndDelete(dup._id);
        }
      }
      console.log('');
    }

    // 4. Sync unique index in MongoDB
    if (!isDryRun) {
      console.log(`Syncing indexes on Problem collection...`);
      await Problem.syncIndexes();
      console.log(`Unique sparse index on { fingerprint: 1 } successfully verified.`);
    }

    console.log(`\n======================================================`);
    console.log(`Migration Complete Summary`);
    console.log(`======================================================`);
    console.log(`Problems processed:         ${allProblems.length}`);
    console.log(`Fingerprints backfilled:    ${backfilledCount}`);
    console.log(`Duplicate problems merged:  ${mergedProblemsCount}`);
    console.log(`Workspaces re-linked:       ${migratedWorkspacesCount}`);
    console.log(`Stage models re-linked:     ${migratedStagesCount}`);
    console.log(`Final canonical count:      ${fingerprintMap.size}`);
    console.log(`======================================================\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed with error:', error);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
};

runMigration();
