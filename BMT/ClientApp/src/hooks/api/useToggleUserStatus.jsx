import moment from 'moment';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useToggleUserStatus = () => {
  const { data, error, loading, postData } = useApi('/BlazorApi/updateuserstatus');

  const updateStatus = async (user, status) => {
    const deleteBody = {
      id: user[0].id,
      email: user[0].email,
      lastName: user[0].lastName,
      password: user[0].password,
      primaryContact: user[0].primaryContact,
      userId: user[0].userId,
      userName: user[0].userName,
      lastUpdatedAt: moment().utc().format(),
      createdAt: user[0].createdAt,
      status: status,
      remarks: 'delete confrimation',
    };

    const response = await postData(deleteBody);
    return response;
  };

  return { data, error, loading, updateStatus };
};
