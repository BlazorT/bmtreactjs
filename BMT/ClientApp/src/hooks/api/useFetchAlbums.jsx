import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';
import { useShowToast } from '../useShowToast';
import { useSelector } from 'react-redux';

export const useFetchAlbums = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Compaigns/albumlists');

  const fetchAlbums = async (body) => {
    const albumBody = {
      id: 0,
      orgId: body?.orgId || user?.orgId,
      rowVer: 1,
      networkId: 0,
      name: '',
      status: 1,
      createdAt: dayjs().utc().subtract(10, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
    };
    const res = await postData(albumBody);
    // alert((res.data.status) );
    if (res && res.status) {
      return res.data;
    } else if (res) {
      showToast(res.message, 'error');
      return [];
    }
    return [];
  };

  return { data: data?.data || [], error, loading, fetchAlbums };
};
