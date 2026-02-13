import { useCallback, useState } from 'react';
import { getInitialCampaignData } from 'src/configs/InputConfig/campaignAddConfig';

/**
 * Custom hook for managing campaign form state
 */
export const useCampaignForm = (user, initialData = null) => {
  const [campaignData, setCampaignData] = useState(() => {
    if (initialData) {
      return {
        ...getInitialCampaignData(user),
        ...initialData,
      };
    }
    return getInitialCampaignData(user);
  });

  const updateCampaignData = useCallback((updates) => {
    setCampaignData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetCampaignData = useCallback(() => {
    setCampaignData(getInitialCampaignData(user));
  }, [user]);

  return {
    campaignData,
    setCampaignData,
    updateCampaignData,
    resetCampaignData,
  };
};
