import { useEffect, useState } from 'react'; // Import Record for type definition

import { initialOptions } from 'src/constants/initialOptionsApi';
import { useShowToast } from './useShowToast';

// Define types for clarity and accuracy
export type ApiPostDataType<T> = Record<string, T | FormData>;

interface ApiPostState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  postData: (data: ApiPostDataType<T>) => Promise<T>;
}

const CRAWLER_API_KEY = process.env.REACT_APP_BMT_SERVIVE_API_KEY;

const useApi = <T>(url: string, method: string = 'POST', initialData?: T): ApiPostState<T> => {
  const [data, setData] = useState<T | null>(initialData || null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // alert(url);
  const showToast = useShowToast();

  const postData = async (postData?: ApiPostDataType<T>) => {
    try {
      setLoading(true);

      const isFormData = postData instanceof FormData;
      const body = isFormData ? postData : JSON.stringify(postData);

      const response = await fetch(url, {
        ...initialOptions,
        method,
        body,
        headers: url?.includes(process.env.REACT_APP_BMT_SERVIVE || '')
          ? {
              'Content-Type': 'application/json',
              'x-api-key': String(CRAWLER_API_KEY),
            }
          : isFormData
            ? undefined // Let the browser set the Content-Type for FormData
            : initialOptions.headers,
      });
      if (!response.ok) {
        showToast(`API error: ${response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (error) {
      setError(error as Error);
      showToast('Error Making Request', 'error');
      // throw error; // Re-throw for error handling in components
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      postData(initialData);
    }
  }, [url, initialData]);

  return { data, error, loading, postData };
};

export default useApi;
