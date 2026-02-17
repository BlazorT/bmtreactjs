import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';
import { useShowToast } from '../useShowToast';

const toNumberOrZero = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const useFetchAllNotification = () => {
  dayjs.extend(utc);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Notifications/mynotifications');

  const fetchRecipients = async (filters) => {
    //console.log(filters);

    const recipientssBody = {
      id: 0,
      OrganizationId: toNumberOrZero(filters?.orgId),
      rowVer: filters?.rowVer ?? 0,
      networkId: toNumberOrZero(filters?.networkId),
      contentId: filters?.contentId || '',
      status: toNumberOrZero(filters?.status),

      createdAt: filters?.createdAt
        ? dayjs(filters.createdAt).local().startOf('day').format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters?.lastUpdatedAt
        ? dayjs(filters.lastUpdatedAt).local().startOf('day').format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD'),
    };

    // console.log({ recipientssBody });
    const res = await postData(recipientssBody);
    console.log(res);
    // alert((res.data.status) );
    if (res && res.status) {
      return res.data;
    } else if (res) {
      showToast(res.message, 'error');
      return [];
    }
    return [];
  };

  return { data, error, loading, fetchRecipients };
};
