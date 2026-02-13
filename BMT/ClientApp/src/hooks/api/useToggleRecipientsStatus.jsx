import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import useApi from '../useApi';

dayjs.extend(utc);

export const useToggleRecipientsStatus = () => {
  const { data, error, loading, postData } = useApi('/Compaigns/updatecrecipient');
  const user = useSelector((state) => state.user);
  const updateStatus = async (recipient, newStatus) => {
    if (!recipient?.id) {
      return { status: false, message: 'Invalid recipient' };
    }
    //const network = globalutil.networks().find((n) => n.id === networkId);
    const body = {
      ...recipient,
      status: newStatus, // 2 = inactive/delete, 1 = active/reactivate
      desc: recipient?.desc || '',
      lastUpdatedBy: user.userId || 0,
      lastUpdatedAt: dayjs().utc().format(),
      createdAt: recipient?.createdAt || dayjs().utc().format(),
      createdBy: user.userId || recipient?.createdBy || 0,
      rowVer: recipient.rowVer || recipient.RowVer || 0,
    };

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
