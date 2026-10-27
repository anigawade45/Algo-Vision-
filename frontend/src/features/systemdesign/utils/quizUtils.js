/**
 * Checkpoint Quiz Assessment & Scoring Utilities
 * Unified calculation and grading helpers for System Design quiz sections
 */

/**
 * Calculates quiz score, percentage, and detailed answers breakdown
 *
 * @param {Array<{ id: number|string, correctIndex: number }>} questions - Quiz questions array
 * @param {Record<string|number, number>} userAnswers - Map of question id to user selected option index
 * @returns {{
 *   score: number,
 *   total: number,
 *   percentage: number,
 *   formattedPercentage: string,
 *   isPassed: boolean,
 *   correctIds: Array<any>,
 *   incorrectIds: Array<any>
 * }}
 */
export function calculateQuizScore(questions = [], userAnswers = {}) {
  const total = questions.length;
  if (total === 0) {
    return {
      score: 0,
      total: 0,
      percentage: 0,
      formattedPercentage: '0%',
      isPassed: false,
      correctIds: [],
      incorrectIds: []
    };
  }

  let score = 0;
  const correctIds = [];
  const incorrectIds = [];

  for (const q of questions) {
    const selected = userAnswers[q.id];
    if (selected === q.correctIndex) {
      score++;
      correctIds.push(q.id);
    } else {
      incorrectIds.push(q.id);
    }
  }

  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 75;

  return {
    score,
    total,
    percentage,
    formattedPercentage: `${percentage}%`,
    isPassed,
    correctIds,
    incorrectIds
  };
}

/**
 * Checks whether all questions in the quiz have been answered
 *
 * @param {Array<{ id: number|string }>} questions
 * @param {Record<string|number, number>} userAnswers
 * @returns {boolean}
 */
export function isAllQuestionsAnswered(questions = [], userAnswers = {}) {
  if (!questions || questions.length === 0) return false;
  return questions.every((q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== null);
}

/**
 * Generates badge styling and qualitative feedback based on score percentage
 *
 * @param {number} percentage - Score percentage (0-100)
 * @returns {{ title: string, message: string, badgeColor: string, isPerfect: boolean }}
 */
export function getQuizFeedback(percentage) {
  if (percentage === 100) {
    return {
      title: 'Flawless Architecture Mastery!',
      message: 'Outstanding! You demonstrated 100% command over all concepts, trade-offs, and failure scenarios.',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      isPerfect: true
    };
  }
  if (percentage >= 75) {
    return {
      title: 'Checkpoint Passed with Distinction!',
      message: 'Great job! You have a solid grasp of core trade-offs and system constraints.',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      isPerfect: false
    };
  }
  return {
    title: 'Review Suggested',
    message: 'Review the concept sections and visualizer modules above to reinforce your understanding.',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    isPerfect: false
  };
}
