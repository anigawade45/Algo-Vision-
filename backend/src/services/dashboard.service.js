const env = require('../config/env');
const serializeUser = require('../utils/serializeUser');

/**
 * Static catalog of learning modules. `total` comes from real content once the
 * DSA / OS / CN / System Design modules exist; until then it is 0.
 */
const MODULE_CATALOG = [
  { id: 'dsa', name: 'Data Structures & Algorithms' },
  { id: 'os', name: 'Operating Systems' },
  { id: 'cn', name: 'Computer Networks' },
  { id: 'sysdesign', name: 'System Design' },
];

// Derived, never hard-coded: the old mock said 24/36 = 68% (it is 67%).
const percent = (completed, total) => (total > 0 ? Math.round((completed / total) * 100) : 0);

const buildModule = (definition, { completed = 0, total = 0 } = {}) => ({
  ...definition,
  completed,
  total,
  progress: percent(completed, total),
});

/**
 * What a real user with no recorded activity sees. This is the production
 * behaviour until progress tracking is implemented.
 */
const buildEmptyOverview = () => ({
  isPlaceholder: false,
  continueLearning: null,
  modules: MODULE_CATALOG.map((definition) => buildModule(definition)),
  stats: {
    problemsSolved: 0,
    topicsCompleted: 0,
    learningStreak: 0,
    learningHours: 0,
  },
});

/**
 * Demo data for UI development only. Enabled with ENABLE_MOCK_DASHBOARD=true;
 * env.js refuses to start in production with the flag set.
 */
const buildMockOverview = () => {
  const [dsa, os, cn, sysdesign] = MODULE_CATALOG;
  const modules = [
    buildModule(dsa, { completed: 24, total: 36 }),
    buildModule(os, { completed: 15, total: 35 }),
    buildModule(cn, { completed: 12, total: 34 }),
    buildModule(sysdesign, { completed: 8, total: 28 }),
  ];

  return {
    isPlaceholder: true,
    continueLearning: {
      module: 'dsa',
      title: 'Recursion & Backtracking',
      currentStep: 18,
      totalSteps: 25,
      progress: percent(18, 25),
    },
    modules,
    stats: {
      problemsSolved: 0,
      topicsCompleted: modules.reduce((sum, m) => sum + m.completed, 0),
      learningStreak: 14,
      learningHours: 48.5,
    },
  };
};

/**
 * Overview for the authenticated user.
 *
 * Every call builds NEW objects. The old module-level constants were returned by
 * reference, so any code that mutated the response (a serializer, a future
 * middleware) would have changed the data for every following user.
 *
 * TODO: replace buildEmptyOverview() with queries against a Progress collection
 * keyed by userId (unique index on { userId, topicId }).
 */
const getDashboardOverview = async (user) => {
  const overview = env.dashboardMock ? buildMockOverview() : buildEmptyOverview();

  return {
    user: serializeUser(user),
    ...overview,
  };
};

module.exports = {
  getDashboardOverview,
};