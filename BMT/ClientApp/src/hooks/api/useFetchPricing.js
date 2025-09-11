import useApi, { ApiPostDataType } from '../useApi';
import { useShowToast } from '../useShowToast';
import { useSelector } from 'react-redux';


export const useFetchPricing = () => {
  const showToast = useShowToast();
  const user = useSelector((state) => state.user);
 // const { data, error, loading, postData } = useApi('/Admin/custombundlingdetails','GET');
  const { data, error, loading, postData } = useApi('/Admin/custombundlingdetails');

  const fetchPricing = async () => {
    const bodyData = {
      orgId: String(user.orgId === 1 ? 0 : user.orgId),
      name: '',
      email: '',
      filters: '', // ✅ required field
      datefrom: new Date(Date.now() - 86400000).toISOString(),
      dateto: new Date().toISOString(),
      status: '',
    };
    console.log(JSON.stringify(bodyData));
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
