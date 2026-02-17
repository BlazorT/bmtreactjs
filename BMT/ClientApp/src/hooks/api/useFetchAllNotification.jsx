import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';
import { useShowToast } from '../useShowToast';
import { useSelector } from 'react-redux';

const toNumberOrZero = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const useFetchAllNotification = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  //const orgId = user.orgId;
  const Role = user.roleId;
  const { data, error, loading, postData } = useApi('/Notifications/allnotifications');

  const fetchRecipients = async (filters) => {
    console.log("filters data",filters);

    const recipientssBody = {
      id: 0,
      CreatedBy: Role == 4 ? Role:0,
      OrganizationId: toNumberOrZero(filters?.orgId),
      rowVer: filters?.rowVer ?? 0,
      networkId: toNumberOrZero(filters?.networkId),
      recipient: filters?.recipient || '',
      deliveryStatus: toNumberOrZero(filters?.deliveryStatus),
      status:0,
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
