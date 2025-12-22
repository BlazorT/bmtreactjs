import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';
import { useShowToast } from '../useShowToast';

export const useFetchCampaigns = () => {
  dayjs.extend(utc);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Compaigns/detailedcompaigns');

  const fetchCompaigns = async (filters) => {
    // alert(JSON.stringify(filters));
    const compaignsBody = {
      id: 0,
      orgId: filters ? filters.orgId : 0,
      rowVer: filters ? filters.rowVer : 0,
      networkId: filters ? parseInt(filters.networkId || '0') : 0,
      Name: filters ? filters.name : '',
      HashTags: filters ? filters.HashTags : '',
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      createdAt: filters
        ? dayjs(filters.createdAt).local().format('YYYY-MM-DD')
        : dayjs().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).local().format('YYYY-MM-DD')
        : dayjs().utc().format(),
    };

    const res = await postData(compaignsBody);
    // alert((res.data.status) );
    if (res && res.status) {
      return res.data;
    } else if (res) {
      showToast(res.message, 'error');
      return [];
    }
    return [];
  };

  return { data, error, loading, fetchCompaigns };
};
