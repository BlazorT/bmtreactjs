/* eslint-disable no-undef */
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { initialOptions } from 'src/constants/initialOptionsApi';
import { updateToast } from 'src/redux/toast/toastSlice';

function useFetch() {
  const dispatch = useDispatch();

  const response = useRef();
  const error = useRef();
  const loading = useRef();
  const abortControllerRef = useRef();

  const checkServerStatus = async () => {
    const serverStatusUrl = `192.168.50.18`;
    try {
      const res = await fetch(serverStatusUrl);
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const fetchData = async (url, customOptions, callback) => {
    // Cleanup previous abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fullUrl = `${process.env.REACT_APP_API_BASE_URL || ''}${url}`;
    console.log(fullUrl);

    try {
      loading.current = true;
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
      console.log(json);
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
