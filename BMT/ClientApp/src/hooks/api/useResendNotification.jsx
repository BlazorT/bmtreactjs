import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useApi from '../useApi';

export const useResendNotification = () => {
  dayjs.extend(utc);
  const { data, error, loading, postData } = useApi('/Notifications/createsinglenotification');

  const resendNotification = async (value) => {

  //  console.log("valuevalue", value);

    if (!value || !value?.row) {
      console.error("Invalid value received");
      return null;
    }

    const row = value.row;

    const resendBody = {
      id: 0,
      networkId: row.networkById,
      organizationId: row.organizationId === 1 ? 0 : row.organizationId,
      status: row.status,
      notificationTypeId: row.notificationTypeId,
      retriesAvailedCount: row.retriesAvailedCount,
      createdBy: row.createdBy,
      createdAt: dayjs().utc().toISOString(),
      lastUpdatedBy: row.lastUpdatedBy,
      lastUpdatedAt: dayjs().utc().toISOString(),
      rowVer: row.rowVer,
      ExpiryTime: row.expiryTime,
    };

   // console.log('resendBody', resendBody);

    try {
      const response = await postData(resendBody);
      return response;
    } catch (error) {
      console.error("Resend failed:", error);
      return null;
    }
  };

  return { data, error, loading, resendNotification };
};
