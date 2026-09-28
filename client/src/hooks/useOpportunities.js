import { useState, useEffect, useCallback } from 'react';
import { getOpportunities } from '../api/opportunityApi';

const useOpportunities = (initialFilters = {}) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  const fetchOpportunities = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getOpportunities({ ...filters, ...params, page });
      setOpportunities(data.opportunities || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    opportunities,
    loading,
    error,
    total,
    page,
    setPage,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchOpportunities,
  };
};

export default useOpportunities;
