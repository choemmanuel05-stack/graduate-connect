import api from './api';

export const companyService = {
  getCompanies: (params?: { search?: string; industry?: string }) =>
    api.get('/companies/', { params }),
  getCompany: (id: number) => api.get(`/companies/${id}/`),
};
