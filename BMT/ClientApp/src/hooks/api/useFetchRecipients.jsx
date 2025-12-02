import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';
import { useShowToast } from '../useShowToast';

export const useFetchRecipients = () => {
  dayjs.extend(utc);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/campaignrecipients');

  const fetchRecipients = async (filters) => {
    //alert(JSON.stringify(filters));
    const recipientssBody = {
      id: 0,
      orgId: filters ? parseInt(filters.orgId) : 0,
      rowVer: filters ? filters.rowVer : 0,
      networkId: filters ? parseInt(filters.networkId) : 0,
      contentId: filters ? filters.contentId : '',
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),

      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD'),
    };

    const res = await postData(recipientssBody);
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
