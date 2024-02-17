import useFetch from '../useFetch';

import { useSelector } from 'react-redux';
import { useShowToast } from '../useShowToast';

export const useFetchDsps = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const { fetchData: fetchDsps } = useFetch();

  const getDsps = async (filters) => {
    const dspsBody = {
      dspid: user.roleId === 1 ? 0 : user.dspId,
      name: '',
      address: '',
      contact: '',
      email: '',
      rowVer: 0,
      ...filters,
    };

    // Wrap the fetchUsers call in a Promise
    return new Promise((resolve, reject) => {
      fetchDsps(
        '/BlazorApi/dspsfulldata',
        { method: 'POST', body: JSON.stringify(dspsBody) },
        (res) => {
          if (res.status) {
            resolve(res.data.data);
          } else if (res.status === 400) {
            showToast(res.message, 'error');
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    });
  };

  return { getDsps };
};
