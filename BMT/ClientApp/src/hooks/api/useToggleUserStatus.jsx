import moment from 'moment';

import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useToggleUserStatus = () => {
  const { data, error, loading, postData } = useApi('/BlazorApi/updateuserstatus');

  const updateStatus = async (user, status) => {
    const deleteBody = {
      id: user[0].id,
      paymentDetailId: user[0].paymentDetailId,
      orgId: user[0].orgId === 1 ? 0 : user[0].orgId,
      userCode: "",
      registrationSource: user[0].registrationSource,
      fmctoken: user[0].fmctoken,
      cityId: user[0].cityId,
      userName: user[0].userName,
      securityToken: user[0].securityToken,
      contact: user[0].contact,
      firstName: "",
      middleName: user[0].middleName,
      lastName: "",
      nick: user[0].nick,
      email: user[0].email,
      password: user[0].password,
      roleId: user[0].roleId,
      gpslocation: user[0].gpslocation,
      ims: user[0].ims,
      addressId: user[0].addressId,
      genderId: user[0].genderId,
      avatar: user[0].avatar,
      remarks: 'delete confirmation',
      title: user[0].title,
      status: status,
      businessVolume: user[0].businessVolume,
      dob: user[0].dob,
      registrationTime: user[0].registrationTime,
      createdBy: user[0].createdBy,
      createdAt: user[0].createdAt,
      lastUpdatedBy: user[0].lastUpdatedBy,
      lastUpdatedAt: moment().utc().format(),
      rowVer: user[0].rowVer,
      cityName: user[0].cityName,
      completeName: user[0].completeName,
      roleName: user[0].roleName,
      orgName: user[0].orgName,
      stateName: user[0].stateName,
    };
    console.log("deleteBody", deleteBody);
    const response = await postData(deleteBody);
    return response;
  };


  return { data, error, loading, updateStatus };
};
