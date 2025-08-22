import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useToggleOrgStatus = () => {
  dayjs.extend(utc);
  const { data, error, loading, postData } = useApi('/BlazorApi/adupdateorg');

  const updateStatus = async (user, status) => {
    const deleteBody = {
      id: user[0].id,
      orgId: user[0].orgId === 1 ? 0 : user[0].orgId,
     
      status: status,
      address:"",
      Contact:"",
      Email:"",
      Name:"",
      createdBy: user[0].createdBy,
      createdAt: user[0].createdAt,
      lastUpdatedBy: user[0].lastUpdatedBy,
      lastUpdatedAt: dayjs().utc().format(),
      rowVer: user[0].rowVer,
    
    };
    console.log("deleteBody", deleteBody);
    const response = await postData(deleteBody);
    return response;
  };


  return { data, error, loading, updateStatus };
};
