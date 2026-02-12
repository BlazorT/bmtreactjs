import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useShowToast } from '../useShowToast'; // if needed for toast
import useApi from '../useApi';
import globalutil from 'src/util/globalutil';
import { useSelector } from 'react-redux';

dayjs.extend(utc);

export const useToggleRecipientsStatus = () => {
  const { data, error, loading, postData } = useApi('/Compaigns/updatecrecipient');
  const user = useSelector((state) => state.user);
  const updateStatus = async (recipient, newStatus) => {
    if (!recipient?.id) {
      console.error('No recipient ID provided');
      return { status: false, message: 'Invalid recipient' };
    }
    //const network = globalutil.networks().find((n) => n.id === networkId);
    const body = {
      id: recipient.id,
      ContentId: recipient.contentId || '',
      CreatedBy: user.userId || 0,
      networkId: recipient.nId || recipient.nId || 0,
      status: newStatus,              // 2 = inactive/delete, 1 = active/reactivate
      LastUpdatedBy: user.userId || 0,
      orgId: user.orgId || 0,
      LastUpdatedAt: dayjs().utc().format(),
      CreatedAt: dayjs().utc().format(),
      RowVer: recipient.rowVer || recipient.RowVer || 0,
    };

    console.log('recipient', recipient);
    console.log('Sending status update body:', body);

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
