const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config(); // Fallback to cwd

const mongoose = require('mongoose');
const crypto = require('crypto');
const Problem = require('../models/Problem');
const {
  normalizeText: serviceNormalizeText,
  generateProblemFingerprint: serviceGenerateProblemFingerprint,
} = require('../services/problem.service');

// Ensure functions are identical to problem.service.js
const normalizeText =
  serviceNormalizeText ||
  ((text) => {
    if (!text) return '';
    return String(text)
      .toLowerCase()
      .replace(/\r\n/g, '\n')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  });

const generateProblemFingerprint =
  serviceGenerateProblemFingerprint ||
  ((title, description) => {
    const normTitle = normalizeText(title);
    const normDesc = normalizeText(description);
    const contentToHash = `${normTitle}:::${normDesc}`;
    return crypto.createHash('sha256').update(contentToHash).digest('hex');
  });

const hasFingerprint = (value) =>
  typeof value === 'string' && value.trim().length > 0;

async function main() {
  const applyChanges = process.argv.includes('--apply');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Set MONGO_URI or MONGODB_URI in your environment.');
  }

  await mongoose.connect(mongoUri);

  try {
    const problems = await Problem.find({})
      .select('_id problemId title description constraints fingerprint')
      .lean();

    const existingFingerprints = new Map();
    const missing = [];

    for (const problem of problems) {
      if (hasFingerprint(problem.fingerprint)) {
        const ids = existingFingerprints.get(problem.fingerprint) || [];
        ids.push(String(problem._id));
        existingFingerprints.set(problem.fingerprint, ids);
      } else {
        missing.push({
          ...problem,
          computedFingerprint: generateProblemFingerprint(
            problem.title,
            problem.description,
            problem.constraints || []
          ),
        });
      }
    }

    // Group missing records by their computed fingerprint.
    const groups = new Map();

    for (const problem of missing) {
      const fp = problem.computedFingerprint;
      const group = groups.get(fp) || [];
      group.push(problem);
      groups.set(fp, group);
    }

    const safeToBackfill = [];
    const collisions = [];

    for (const [fingerprint, group] of groups) {
      const existingIds = existingFingerprints.get(fingerprint) || [];

      if (group.length > 1 || existingIds.length > 0) {
        collisions.push({
          fingerprint,
          missingProblems: group.map((p) => ({
            _id: String(p._id),
            problemId: p.problemId,
            title: p.title,
          })),
          alreadyFingerprintedProblemIds: existingIds,
        });
      } else {
        safeToBackfill.push(group[0]);
      }
    }

    console.log('\n=== Fingerprint Backfill Report ===');
    console.log(`Total problems: ${problems.length}`);
    console.log(`Missing/blank fingerprints: ${missing.length}`);
    console.log(`Safe candidates: ${safeToBackfill.length}`);
    console.log(`Collision groups: ${collisions.length}`);
    console.log(`Mode: ${applyChanges ? 'APPLY' : 'DRY RUN'}`);

    if (collisions.length > 0) {
      console.log('\n=== Collisions — NOT UPDATED ===');
      console.dir(collisions, { depth: null });
    }

    if (!applyChanges) {
      console.log(
        '\nDry run only. Review collisions before running with --apply.'
      );
      return;
    }

    let updated = 0;
    let skipped = 0;

    for (const problem of safeToBackfill) {
      // Conditional update protects against overwriting a fingerprint
      // added after this script read the document.
      const result = await Problem.updateOne(
        {
          _id: problem._id,
          $or: [
            { fingerprint: { $exists: false } },
            { fingerprint: null },
            { fingerprint: '' },
          ],
        },
        {
          $set: { fingerprint: problem.computedFingerprint },
        },
        { runValidators: true }
      );

      if (result.modifiedCount === 1) {
        updated++;
      } else {
        skipped++;
      }
    }

    console.log('\n=== Migration Result ===');
    console.log(`Updated: ${updated}`);
    console.log(`Skipped due to changed records: ${skipped}`);
    console.log(`Unresolved collision groups: ${collisions.length}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error('Fingerprint migration failed:', error);
  process.exitCode = 1;
});
