import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useShowToast } from '../useShowToast'; // if needed for toast
import useApi from '../useApi';

dayjs.extend(utc);

export const useToggleRecipientsStatus = () => {
  const { data, error, loading, postData } = useApi('/Compaigns/updatecrecipient');

  const updateStatus = async (recipient, newStatus) => {
    // recipient should be the row object from your grid (params.row)
    if (!recipient?.id) {
      console.error('No recipient ID provided');
      return { status: false, message: 'Invalid recipient' };
    }

    // Build minimal body matching CompaignrecipientModel
    const body = {
      id: recipient.id,                    // must be number/long
      ContentId: recipient.contentId,                    // must be number/long
      CreatedBy: recipient.lastUpdatedBy || 0,                    // must be number/long
      status: newStatus,                   // 4 = delete, 5 = reactivate
      lastUpdatedBy: recipient.lastUpdatedBy || 0,   // current user ID if available
      lastUpdatedAt: dayjs().utc().format(),         // ISO format
      rowVer: recipient.rowVer || 0,       // keep current version (concurrency)

      // Optional: only include if your backend requires them for update
      // networkId: recipient.networkId,
      // albumid: recipient.albumid,
      // contentId: recipient.contentId,
    };

    console.log('Sending status update body:', body);
    console.log('recipient:', recipient);

    try {
      const response = await postData(body);
      return response;
    } catch (err) {
      console.error('Status update failed:', err);
      return { status: false, message: 'Request failed' };
    }
  };

  return { data, error, loading, updateStatus };
};
