import api from './api';

export const jobService = {
  getJobs: (params?: { search?: string; job_type?: string; location?: string }) =>
    api.get('/jobs/', { params }),

  getJob: (id: number) => api.get(`/jobs/${id}/`),

  applyToJob: (id: number, cover_letter: string) =>
    api.post(`/jobs/${id}/apply/`, { cover_letter }),

  getMyApplications: () => api.get('/jobs/my-applications/'),

  // Employer
  createJob: (data: any) => api.post('/jobs/', data),
  updateJob: (id: number, data: any) => api.put(`/jobs/${id}/`, data),
  deleteJob: (id: number) => api.delete(`/jobs/${id}/`),
  getEmployerJobs: () => api.get('/employers/jobs/'),
  getJobApplications: (jobId: number) => api.get(`/employers/jobs/${jobId}/applications/`),
  updateApplicationStatus: (jobId: number, appId: number, status: string) =>
    api.patch(`/employers/jobs/${jobId}/applications/`, { application_id: appId, status }),
};
