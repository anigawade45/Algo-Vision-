/**
 * TEMPORARY MOCK DASHBOARD DATA
 * 
 * Replace these values with real learning/progress data when
 * DSA, OS, CN and System Design backend modules are implemented.
 */
const dashboardDefaults = {
  continueLearning: {
    module: 'dsa',
    title: 'Recursion & Backtracking',
    currentStep: 18,
    totalSteps: 25,
    progress: 72,
  },

  modules: [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      progress: 68,
      completed: 24,
      total: 36,
    },
    {
      id: 'os',
      name: 'Operating Systems',
      progress: 42,
      completed: 15,
      total: 35,
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      progress: 35,
      completed: 12,
      total: 34,
    },
    {
      id: 'sysdesign',
      name: 'System Design',
      progress: 28,
      completed: 8,
      total: 28,
    },
  ],

  stats: {
    problemsSolved: 0,
    topicsCompleted: 59,
    learningStreak: 14,
    learningHours: 48.5,
  },
};

/**
 * Fetch overview data for the authenticated dashboard user
 */
const getDashboardOverview = async (user) => {
  const userObj = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };

  const safeUser = {
    id: userObj._id || userObj.id,
    name: userObj.name,
    email: userObj.email,
    avatar: userObj.avatar ?? null,
  };

  return {
    user: safeUser,
    continueLearning: dashboardDefaults.continueLearning,
    modules: dashboardDefaults.modules,
    stats: dashboardDefaults.stats,
  };
};

module.exports = {
  getDashboardOverview,
};
