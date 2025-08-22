import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useToggleCampaignStatus = () => {
  dayjs.extend(utc);
  const { data, error, loading, postData } = useApi('/Compaigns/updatecompaign');

  const updateStatus = async (user, status) => {
    const deleteBody = {
      id: user[0].id,
      status: status,
      createdBy: user[0].createdBy,
      createdAt: user[0].createdAt,
      lastUpdatedBy: user[0].lastUpdatedBy,
      lastUpdatedAt: dayjs().utc().format(),
      rowVer: user[0].rowVer
    };

    const response = await postData(deleteBody);
    return response;
  };


  return { data, error, loading, updateStatus };
};
