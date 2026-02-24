import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';

export const useResendNotification = () => {
  dayjs.extend(utc);
  const { data, error, loading, postData } = useApi('/BlazorApi/updateuserstatus');

  const resendNotification = async (value, status) => {
    let resendBody;
    if (value) {
      resendBody = {
        id: value[0].id,
        networkId: value[0].networkId,
        orgId: value[0].organizationId === 1 ? 0 : value[0].organizationId,
        roleId: value[0].roleId,
        status: status,
        createdBy: value[0].createdBy,
        createdAt: value[0].createdAt,
        lastUpdatedBy: value[0].lastUpdatedBy,
        lastUpdatedAt: dayjs().utc().format(),
        rowVer: value[0].rowVer,
      };
    }
    console.log('resendBody', resendBody);
    const response = await postData(resendBody);
    return response;
  };

  return { data, error, loading, resendNotification };
};
