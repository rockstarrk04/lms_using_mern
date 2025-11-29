import useSWR from 'swr';
import { API_BASE_URL } from '../api/client';

const fetcher = (token) => async (url) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const useApi = (path, token, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  const { data, error, mutate } = useSWR(url, fetcher(token), options);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
