import moment from 'moment';

import { useSelector } from 'react-redux';
import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';

export const useCreateCampaignData = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const { fetchData: registerCampaign } = useFetch();

  const createUpdateCampaign = async (campaignRegData) => {
    const body = {
      ...campaignRegData,
      lastUpdatedAt: moment().utc().format(),
      lastUpdatedBy: user.userId,
      updatedBy: user.userId,
    };
    console.log({ body });

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
