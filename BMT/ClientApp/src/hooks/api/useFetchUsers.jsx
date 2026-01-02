import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchUsers = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  const { data, error, loading, postData } = useApi('/BlazorApi/users');

  const fetchUsers = async (role, filters, orgId) => {
    const userBody = {
      // userCode: user.userId.toString(),
      id: 0,
      roleId: role,
      orgId: orgId == 0 ? orgId : user.roleId === 1 ? 0 : user.orgId,
      email: '',
      userCode: '',
      //userName: '',
      //userName: filters ? (filters.userName === '' ? '' : filters.userName) : '',
      lastName: '',
      firstName: '',
      password: '',
      // contact: "",
      rowVer: 0,
      genderId: 0,
      securityToken: '',
      registrationTime: dayjs().utc().format(),
      cityId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : parseInt(filters.status)) : 0,
      userName: filters ? filters.UserName : '',
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD'),
    };
    const res = await postData(userBody);
    if (res?.status) {
      return res.data;
    } else {
      showToast(res?.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchUsers };
};
