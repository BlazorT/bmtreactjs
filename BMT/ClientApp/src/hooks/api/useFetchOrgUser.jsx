import moment from 'moment';

import { useSelector } from 'react-redux';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchOrgUser = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/userandorgusers');

  const fetchUsers = async (role, filters) => {
    const OrgUserBody = {
      // userCode: user.userId.toString(),
      id: 0,
      roleId: role,     
      orgId: user.orgId === 1 ? 0 : user.orgId,
      email: '',
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
     // keyword: filters ? filters.keyword : '',
      dateTo: filters
        ? moment(filters.dateTo).utc().format('YYYY-MM-DD')
        : moment().subtract(1, 'year').utc().format(),
      dateFrom: filters
        ? moment(filters.dateFrom).utc().format('YYYY-MM-DD')
        : moment().utc().format(),
    };
   // console.log(userBody,'body')
    const res = await postData(OrgUserBody);
     alert(JSON.stringify( res) );
    if (res.status) {
      return res.data;
    } else {
      showToast(res.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchUsers };
};
