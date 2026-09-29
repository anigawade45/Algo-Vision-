import React from 'react';
import { Navigate } from 'react-router-dom';
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
    path: '/dsa/problem/new',
    element: <ProblemSubmit />,
    title: 'New Problem',
  },
  {
    path: '/dsa/submit',
    element: <Navigate to="/dsa/problem/new" replace />,
    title: 'Submit Problem Redirect',
  },
  {
    path: '/dsa/workspace/:id',
    element: <ProblemWorkspace />,
    title: 'Problem Workspace',
  },
  {
    path: '/dsa/workspace',
    element: <Navigate to="/dsa/workspace/two-sum" replace />,
    title: 'Problem Workspace Redirect',
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
