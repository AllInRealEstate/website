import { publicApi } from './api';

export const submitLead = async (leadData) => {
  try {
    const response = await publicApi.post('/leads', leadData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit message');
  }
};
