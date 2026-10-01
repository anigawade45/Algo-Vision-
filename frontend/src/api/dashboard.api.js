import apiClient from './apiClient';

/**
 * Fetch overview data for the authenticated student dashboard
 */
export const getDashboardOverview = async () => {
  return await apiClient.get('/dashboard/overview');
};
