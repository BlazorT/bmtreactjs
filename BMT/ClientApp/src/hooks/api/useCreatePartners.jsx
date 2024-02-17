import moment from 'moment';

import { useSelector } from 'react-redux';
import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';

export const useCreatePartners = () => {
  const showToast = useShowToast();
  const { fetchData: registerPartner } = useFetch();

  const createPartners = async (body) => {
    return new Promise((resolve) => {
      registerPartner(
        '/BlazorApi/submitdsppartners',
        { method: 'POST', body: JSON.stringify(body) },
        (res) => {
          if (res.status) {
            showToast(res.message);
            resolve(res);
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    });
  };

  return { createPartners };
};
