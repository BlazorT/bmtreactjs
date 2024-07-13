import useApi, { ApiPostDataType } from '../useApi';
import { useShowToast } from '../useShowToast';


export const useFetchProducts = () => {
  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Admin/packageslist','GET');

  const fetchProducts = async () => {

    const res = await postData();
    console.log({res},'pkg')
    if (res?.status === true) {
      return res?.data;
    } else {
      showToast(res?.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchProducts };
};
