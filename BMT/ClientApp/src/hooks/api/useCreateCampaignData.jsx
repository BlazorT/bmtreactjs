import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';

export const useCreateCampaignData = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const { fetchData: registerCampaign } = useFetch();

  const createUpdateCampaign = async (campaignRegData) => {
    const body = {
      ...campaignRegData,
      lastUpdatedAt: dayjs().utc().format(),
      lastUpdatedBy: user.userId,
      updatedBy: user.userId,
    };
    console.log("Campaign Data ",{ body });

    return new Promise((resolve) => {
      registerCampaign(
        '/Compaigns/postCompaignData',
        { method: 'POST', body: JSON.stringify(body) },
        (res) => {
          if (res.status) {
            resolve(res);
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    });
  };

  return { createUpdateCampaign };
};
