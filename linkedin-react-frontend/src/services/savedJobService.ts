import api from './api';

export const savedJobService = {
  getSavedJobs: () => api.get('/jobs/saved/'),
  toggleSave: (jobId: number) => api.post('/jobs/saved/', { job_id: jobId }),
  getSavedStatus: (jobId: number) => api.get(`/jobs/${jobId}/saved-status/`),
  withdrawApplication: (applicationId: number) =>
    api.delete(`/jobs/applications/${applicationId}/withdraw/`),
};
