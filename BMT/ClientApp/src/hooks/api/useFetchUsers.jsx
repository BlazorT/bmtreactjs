import moment from 'moment';

import { useSelector } from 'react-redux';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchUsers = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/users');

  const fetchUsers = async (role, filters) => {
    const userBody = {
      userId: user.userId.toString(),
      roleId: role,
      orgId: user.roleId === 1 ? 0 : user.orgId,
      email: '',
      userCode: '',
      userName: '',
      lastName: '',
      password: '',
      primaryContact: 1,
      rowVer: 0,
      genderId: '',
      securityToken: '',
      businesstype: 0,
      dob: moment().utc().format(),
      registrationTime: moment().utc().format(),
      stateId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? moment(filters.createdAt).utc().format('YYYY-MM-DD')
        : moment().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? moment(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : moment().utc().format(),
    };
    console.log(userBody,'body')
    const res = await postData(userBody);
    // console.log({ res });
    if (res.data.status) {
      return res.data.data;
    } else {
      showToast(res.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchUsers };
};
