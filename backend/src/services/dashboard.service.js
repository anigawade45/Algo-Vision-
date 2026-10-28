const ProblemWorkspace = require('../models/ProblemWorkspace');
const Problem = require('../models/Problem');
const serializeUser = require('../utils/serializeUser');

/**
 * Static catalog of learning modules
 */
const MODULE_CATALOG = [
  { id: 'dsa', name: 'Data Structures & Algorithms', route: '/dsa' },
  { id: 'os', name: 'Operating Systems', route: '/os' },
  { id: 'cn', name: 'Computer Networks', route: '/cn' },
  { id: 'sysdesign', name: 'System Design', route: '/systemdesign' },
];

const percent = (completed, total) => (total > 0 ? Math.round((completed / total) * 100) : 0);

/**
 * Calculate user daily streak based on workspace activity dates
 */
const calculateStreak = (workspaces, userCreatedAt) => {
  const activityDates = new Set();

  for (const w of workspaces) {
    if (w.lastVisitedAt) {
      activityDates.add(new Date(w.lastVisitedAt).toISOString().split('T')[0]);
    }
    if (w.updatedAt) {
      activityDates.add(new Date(w.updatedAt).toISOString().split('T')[0]);
    }
  }

  if (activityDates.size === 0) {
    // If user registered today, give initial 1 day streak
    if (userCreatedAt) {
      const createdStr = new Date(userCreatedAt).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      if (createdStr === todayStr) {
        return 1;
      }
    }
    return 0;
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (!activityDates.has(todayStr) && !activityDates.has(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  const checkDate = new Date(activityDates.has(todayStr) ? today : yesterday);

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (activityDates.has(dateStr)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Overview for the authenticated user based on real database records
 */
const getDashboardOverview = async (user) => {
  const userId = user._id;

  // 1. Fetch all problem workspaces for the user, sorted by last visited
  const workspaces = await ProblemWorkspace.find({ userId })
    .sort({ lastVisitedAt: -1 })
    .populate('problemId', 'problemId title category difficulty isPublished');

  const validWorkspaces = workspaces.filter((w) => w.problemId && w.problemId.isPublished !== false);

  // 2. Count total published DSA problems in database
  const totalDsaProblems = await Problem.countDocuments({ isPublished: true });

  // 3. Calculate solved problems (stage 11 completed)
  const solvedWorkspaces = validWorkspaces.filter(
    (w) => Array.isArray(w.completedStages) && w.completedStages.includes(11)
  );
  const problemsSolved = solvedWorkspaces.length;

  // 4. Calculate total stages completed across all active problems
  const topicsCompleted = validWorkspaces.reduce((sum, w) => {
    return sum + (Array.isArray(w.completedStages) ? w.completedStages.length : 0);
  }, 0);

  // 5. Calculate streak and estimated learning hours (15 min / 0.25h per completed stage)
  const learningStreak = calculateStreak(validWorkspaces, user.createdAt);
  const learningHours = Number((topicsCompleted * 0.25).toFixed(1));

  // 6. Real Continue Learning problem (only if user actually has an active workspace)
  let continueLearning = null;
  if (validWorkspaces.length > 0) {
    const latest = validWorkspaces[0];
    const completedCount = Array.isArray(latest.completedStages) ? latest.completedStages.length : 0;
    const isCompleted = Array.isArray(latest.completedStages) && latest.completedStages.includes(11);

    continueLearning = {
      problemId: latest.problemId._id,
      slug: latest.problemId.problemId,
      title: latest.problemId.title,
      category: latest.problemId.category,
      difficulty: latest.problemId.difficulty,
      currentStage: latest.currentStage || 1,
      totalStages: 11,
      completedStages: latest.completedStages || [],
      completedCount,
      progress: percent(completedCount, 11),
      isCompleted,
      lastVisitedAt: latest.lastVisitedAt,
      route: `/dsa/workspace/${latest.problemId.problemId}`,
    };
  }

  // 7. Core modules with real DSA progress
  const modules = MODULE_CATALOG.map((mod) => {
    if (mod.id === 'dsa') {
      return {
        ...mod,
        completed: problemsSolved,
        total: totalDsaProblems,
        progress: percent(problemsSolved, totalDsaProblems),
      };
    }
    // OS, CN, and System Design tracks
    const moduleTotals = { os: 10, cn: 8, sysdesign: 6 };
    const total = moduleTotals[mod.id] || 0;
    return {
      ...mod,
      completed: 0,
      total,
      progress: 0,
    };
  });

  return {
    user: serializeUser(user),
    continueLearning, // null if user has not started any problem workspace yet
    modules,
    stats: {
      problemsSolved,
      topicsCompleted,
      learningStreak,
      learningHours,
      activeProblems: validWorkspaces.length,
      totalDsaProblems,
    },
  };
};

module.exports = {
  getDashboardOverview,
};