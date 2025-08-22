import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchOrganization = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/orgsfulldata');

  const fetchOrganization = async (role, filters) => {
    const userBody = {
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
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD')
    };
    console.log(userBody,'body')
    const res = await postData(userBody);
    console.log(( res) );
   // alert((res.data.status) );
    if (res.status) {
      return res.data;
    } else {
      showToast(res.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchOrganization };
};
