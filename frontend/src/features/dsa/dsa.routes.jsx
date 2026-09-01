import React from 'react';
import DsaHome from './pages/DsaHome';
import ProblemSubmit from './pages/ProblemSubmit';
import ProblemWorkspace from './pages/ProblemWorkspace';
import ProblemHistory from './pages/ProblemHistory';
import SavedProblems from './pages/SavedProblems';

export const dsaRoutes = [
  {
    path: '/dsa',
    element: <DsaHome />,
    title: 'DSA Home',
  },
  {
    path: '/dsa/submit',
    element: <ProblemSubmit />,
    title: 'Submit Problem',
  },
  {
    path: '/dsa/workspace',
    element: <ProblemWorkspace />,
    title: 'Problem Workspace',
  },
  {
    path: '/dsa/history',
    element: <ProblemHistory />,
    title: 'Problem History',
  },
  {
    path: '/dsa/saved',
    element: <SavedProblems />,
    title: 'Saved Problems',
  },
];

export default dsaRoutes;
