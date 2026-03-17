import { useState, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';

export const useVisitors = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const mutateData = useCallback((newData) => {
    setData(newData);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { 
    data, 
    loading, 
    error, 
    fetchData, 
    mutateData, 
    reset,
    setData 
  };
};

// Hook for paginated visitors
export const usePaginatedVisitors = (initialPage = 1, initialLimit = 50) => {
  const [visitors, setVisitors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVisitors = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await visitorApi.getVisitors({
        page: params.page || initialPage,
        limit: params.limit || initialLimit,
        ...params.filters
      });
      setVisitors(res.data.data);
      setPagination(res.data.pagination);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialLimit]);

  return { visitors, pagination, loading, error, fetchVisitors, setVisitors };
};