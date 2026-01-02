import useApi from '../useApi';
import { useShowToast } from '../useShowToast';
//import { uploadimageData } from 'src/components/UI/ImagePicker';
export const useUpdateOrg = () => {
  const showToast = useShowToast();
  const { postData: fetchData, loading: addOrgLoading } = useApi('/BlazorApi/adupdateor');
  const createUpdateOrg = async (body) => {
    //  alert(JSON.stringify(body));
    const res = await fetchData(body);
    if (res.status) {
      showToast(res.message);
      return res;
    } else {
      showToast(res.message, 'error');
    }
  };

  return { createUpdateOrg, addOrgLoading };
};
