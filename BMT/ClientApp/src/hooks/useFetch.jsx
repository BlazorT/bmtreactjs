/* eslint-disable no-undef */
import { useRef } from 'react';
import { initialOptions } from 'src/constants/initialOptionsApi';

function useFetch() {
  const response = useRef();
  const error = useRef();
  const loading = useRef();
  const abortControllerRef = useRef();

  const fetchData = async (url, customOptions, callback) => {
    loading.current = true;
    // Cleanup previous abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const options = {
        ...initialOptions,
        ...customOptions,
        signal: abortController.signal, // Pass the signal to the options
      };
      //console.log(url, GetNotificationReportData);
      // alert('fetch started' + url);
      const res = await fetch(url, options);
      //  console.log({ res });
      const json = await res.json();
      response.current = json;

      if (callback && typeof callback === 'function') {
        callback(json);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Only set error if it's not an abort error
        error.current = err;
      }
    } finally {
      loading.current = false;
    }
  };

  return { response, error, loading, fetchData, abortController: abortControllerRef.current };
}

export default useFetch;
