import { useState, useEffect } from 'react';
import api from '../services/api';

export const useRecommendedJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recommendations/jobs/')
      .then((res: any) => setJobs(res.results || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading };
};
