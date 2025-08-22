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
      dob: dayjs().utc().format(),
      registrationTime: dayjs().utc().format(),
      stateId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD')
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
