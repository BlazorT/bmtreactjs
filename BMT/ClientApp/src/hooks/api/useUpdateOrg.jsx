import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';
import { useNavigate } from 'react-router-dom';
//import { uploadimageData } from 'src/components/UI/ImagePicker';
export const useUpdateOrg = () => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { fetchData } = useFetch();
  const createUpdateOrg = async (body) => {
  //  alert(JSON.stringify(body));
    return new Promise((resolve) => {
      fetchData('/BlazorApi/adupdateorg', { method: 'POST', body: JSON.stringify(body) }, (res) => {
        resolve(res);
        if (res.status) {
        console.log(res,'submitres');
          //showToast(res.message);
          showToast(res.message);
         // uploadimageData();
        } else {
          showToast(res.message, 'error');
        }
      });
    });
  };
  
  return { createUpdateOrg };
};
