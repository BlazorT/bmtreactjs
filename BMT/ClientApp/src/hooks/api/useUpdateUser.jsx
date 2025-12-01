import { useState } from 'react';
import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';

export const useUpdateUser = () => {
  const showToast = useShowToast();
  const { fetchData } = useFetch();
  const [loading, setLoading] = useState(false);

  const createUpdateUser = async (body) => {
    setLoading(true);
    try {
      const res = await new Promise((resolve) => {
        fetchData(
          '/BlazorApi/updateuser',
          { method: 'POST', body: JSON.stringify(body) },
          (res) => {
            resolve(res);
          },
        );
      });

      if (res.status) {
        showToast(res.message);
        // optionally call uploadimageData() here
      } else {
        showToast(res.message, 'error');
      }

      return res;
    } catch (error) {
      showToast('Something went wrong', 'error');
      return { status: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { createUpdateUser, loading };
};
