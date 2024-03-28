import moment from 'moment';

import { useSelector } from 'react-redux';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchOrgUser = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/users');

  const fetchUsers = async (role, filters) => {
    const OrgUserBody = {
      // userCode: user.userId.toString(),
      id: 0,
      roleId: role,
      orgId: user.orgId === 1 ? 0 : user.orgId,
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
      // dob: moment().utc().format(),
      registrationTime: moment().utc().format(),
      cityId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? moment(filters.createdAt).utc().format('YYYY-MM-DD')
        : moment().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? moment(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : moment().utc().format(),
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
