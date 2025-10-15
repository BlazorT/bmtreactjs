import useApi from '../useApi';
import { useShowToast } from '../useShowToast';

export const useFetchPricing = () => {
  const showToast = useShowToast();
  const { data, error, loading, postData } = useApi('/Admin/bundlingdetails');
  // const { data, error, loading, postData } = useApi('/Admin/custombundlingdetails');

  const fetchPricing = async () => {
    const bodyData = {
      orgId: '0',
    };
    const res = await postData(bodyData);
    if (res?.status === true) {
      return res?.data;
    } else if (res?.message) {
      showToast(res?.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchPricing };
};
