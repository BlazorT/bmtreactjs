import useApi, { ApiPostDataType } from '../useApi';
import { useShowToast } from '../useShowToast';


export const useFetchPricing = () => {
  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Admin/custombundlingdetails','GET');

  const fetchPricing = async () => {

    const res = await postData();
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
