import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';

export const useToggleCampaignStatus = () => {
  dayjs.extend(utc);
  const { data, error, loading, postData } = useApi('/Compaigns/updatecompaign');

  const updateStatus = async (campaign, status) => {
    const deleteBody = {
      id: campaign[0].id,
      status: status,
      createdBy: campaign[0].createdBy,
      createdAt: campaign[0].createdAt,
      lastUpdatedBy: campaign[0].lastUpdatedBy,
      lastUpdatedAt: dayjs().utc().format(),
      rowVer: campaign[0].rowVer,
    };

    const response = await postData(deleteBody);
    return response;
  };

  return { data, error, loading, updateStatus };
};
