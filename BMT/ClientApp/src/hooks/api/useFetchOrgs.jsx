import useFetch from '../useFetch';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useShowToast } from '../useShowToast';

export const useFetchOrgs = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const { fetchData: fetchDsps } = useFetch();

  const getOrgs = async (role,filters) => {
    const orgBody = {
      id: 0,
      roleId: role,
      orgId: 0,
      email: '',
      name: '',
      contact: "",
      rowVer: 0,
      cityId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? moment(filters.createdAt).utc().format('YYYY-MM-DD')
        : moment().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? moment(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : moment().utc().format(),
      ...filters,
    };
    

    // Wrap the fetchUsers call in a Promise
    return new Promise((resolve, reject) => {
      fetchDsps(
        '/BlazorApi/orgsfulldata',
        { method: 'POST', body: JSON.stringify(orgBody) },
        (res) => {
          console.log((res));
          if (res.status) {
            resolve(res.data);
          } else if (res.status === 400) {
            showToast(res.message, 'error');
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    });
  };

  return { getOrgs };
};
