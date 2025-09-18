import useFetch from '../useFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import { useShowToast } from '../useShowToast';

export const useFetchOrgs = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const { fetchData: fetchDsps } = useFetch();
  console.log({ user });
  const getOrgs = async (filters) => {
    const orgBody = {
      id: user?.roleId === 1 ? 0 : user?.orgId,
      roleId: 0,
      orgId: 0,
      email: '',
      name: filters ? (filters.name === '' ? '' : filters.name) : '',
      contact: '',
      rowVer: 0,
      cityId: filters ? (filters.cityId === '' ? 0 : filters.cityId) : 0,
      status: filters ? (filters?.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
    };

    console.log(orgBody, 'orgBody');
    // Wrap the fetchUsers call in a Promise
    return new Promise((resolve, reject) => {
      fetchDsps(
        '/BlazorApi/orgsfulldata',
        { method: 'POST', body: JSON.stringify(orgBody) },
        (res) => {
          console.log(res);
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
