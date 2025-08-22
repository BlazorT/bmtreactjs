import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchOrgUser = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/users');

  const fetchUsers = async (role, filters) => {
    const OrgUserBody = {
      // userCode: user.userId.toString(),
      id: 0,
      roleId: role,
      orgId: user.orgId,
      email: '',
      userCode: '',
      userName: '',
      lastName: '',
      firstName: '',
      password: '',
      contact: "",
      rowVer: 0,
      genderId: 0,
      securityToken: '',
      registrationTime: dayjs().utc().format(),
      cityId: filters ? (filters.cityId === '' ? 0 : filters.cityId) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(2, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD')
    };
    console.log(OrgUserBody,'body')
    const res = await postData(OrgUserBody);
     console.log(res,'orguserss') ;
    if (res.status) {
      return res.data;
    } else {
      showToast(res.message, 'error');
      return [];
    }

  };

  return { data, error, loading, fetchUsers };
};
