import useApi, { ApiPostDataType } from '../useApi';
import { useShowToast } from '../useShowToast';


export const useFetchPricing = () => {
  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Admin/custombundlingdetails','GET');

  const fetchPricing = async () => {
    const bodyData = {
      orgId: '',
      name: '',
      email: '',
      filters: '', // ✅ required field
      datefrom: new Date(Date.now() - 86400000).toISOString(),
      dateto: new Date().toISOString(),
      status: '',
    };
    const res = await postData(bodyData);
    console.log(JSON.stringify(res));
    if (res?.status === true) {
      return res?.data;
    } else {
      showToast(res?.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchPricing };
};
