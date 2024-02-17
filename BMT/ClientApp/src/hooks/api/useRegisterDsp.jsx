import moment from 'moment';

import { useSelector } from 'react-redux';
import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';

export const useRegisterDsp = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const { fetchData: registerDsp } = useFetch();

  const createUpdateDsp = async (dspRegData) => {
    const body = {
      ...dspRegData,
      address: dspRegData.surfaceAddress,
      whatsApp: dspRegData.isWhatsappAsso === true ? dspRegData.contact : '',
      stateId: parseInt(dspRegData.stateId),
      businessTypeId: parseInt(dspRegData.businessTypeId),
      lastUpdatedAt: moment().utc().format(),
      lastUpdatedBy: user.userId,
      updatedBy: user.userId,
    };
    console.log({ body });

    return new Promise((resolve) => {
      registerDsp(
        '/BlazorApi/adupdatedsp',
        { method: 'POST', body: JSON.stringify(body) },
        (res) => {
          if (res.status) {
            resolve(res);
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    });
  };

  return { createUpdateDsp };
};
