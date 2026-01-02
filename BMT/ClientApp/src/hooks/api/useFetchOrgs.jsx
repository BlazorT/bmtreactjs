import useFetch from '../useFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchOrgs = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const {
    postData: fetchOrgs,
    loading: orgsLoading,
    data: orgData,
  } = useApi('/BlazorApi/orgsfulldata');

  const getOrgs = async (filters) => {
    const orgBody = {
      id: user?.roleId === 1 ? 0 : user?.orgId,
      roleId: 0,
      orgId: 0,
      email: '',
      name: filters?.name ? (filters.name === '' ? '' : filters.name) : '',
      contact: '',
      rowVer: 0,
      cityId: filters?.cityId ? (filters.cityId === '' ? 0 : filters.cityId) : 0,
      status: filters?.status ? (filters?.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters ? filters.createdAt : dayjs().utc().startOf('year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters?.lastUpdatedAt
        ? filters.lastUpdatedAt
        : dayjs().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
    };

    // console.log(orgBody, 'orgBody');
    // Wrap the fetchUsers call in a Promise
    const res = await fetchOrgs(orgBody);

    if (res.status) {
      return res.data;
    } else if (res.status === 400) {
      showToast(res.message, 'error');
    } else {
      showToast(res.message, 'error');
    }
  };

  return { getOrgs, orgsLoading, orgData: orgData?.data || [] };
};
