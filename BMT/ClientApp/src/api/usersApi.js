import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
//import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';

export const getUserbyRole = async (user, role, fetchUsers, dispatch, filters) => {
  dayjs.extend(utc);
  const fetchBody = {
    userId: user.userId.toString(),
    roleId: role,
    orgId: user.orgId,
    email: '',
    userName: '',
    lastName: '',
    password: '',
    primaryContact: '',
    businesstype: 0,
    stateId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
    status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
    keyword: filters ? filters.keyword : '',
    createdAt : filters
      ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
      : dayjs().subtract(1, 'year').utc().format(),

    lastUpdatedAt : filters
      ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
      : dayjs().utc().format()
  };

  // Wrap the fetchUsers call in a Promise
  return new Promise((resolve, reject) => {
    fetchUsers(
      '/BlazorApi/users',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        if (res.data.status) {
          resolve(res.data.data); // Resolve the Promise with the data
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          reject(new Error('Error fetching user data')); // Reject the Promise with an error
        }
      },
    );
  });
};

export const updateUser = async (user, newUserData, createUser, dispatch, navigate) => {
  const data = {
    id: newUserData.id || 0,
    avatar: newUserData.avatar,
    firstName: newUserData.firstName,
    middleName: newUserData.middleName,
    lastName: newUserData.lastName,
    email: newUserData.email,
    primaryContact: newUserData.contact,
    secondaryContact: newUserData.isWhatsappAsso ? newUserData.contact : '',
    status: newUserData.status || 1,
    address: newUserData.address,
    userId: newUserData.userId,
    userName: newUserData.userName,
    password: btoa(newUserData.password),
    stateId: newUserData.state,
    roleId: newUserData.roleId,
    orgid: newUserData.orgId,
    rowVer: newUserData.rowVer || 1,
    lastUpdatedBy: user.userId,
    createdBy: newUserData.createdBy || user.dspId,
    createdAt: newUserData.createdAt,
    lastUpdatedAt: dayjs().utc().format(),
    remarks: 'created user',
  };

  // Wrap the fetchUsers call in a Promise
  return new Promise((resolve, reject) => {
    createUser('/BlazorApi/updateda', { method: 'POST', body: JSON.stringify(data) }, (res) => {
      if (res.status) {
        resolve(res);
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: res.message,
            toastVariant: 'success',
          }),
        );
        navigate('/Users');
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: res.message,
            toastVariant: 'error',
          }),
        );
        reject(new Error('Error Creating user'));
      }
    });
  });
};
