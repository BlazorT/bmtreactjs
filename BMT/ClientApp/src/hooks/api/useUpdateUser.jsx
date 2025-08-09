import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';
import { useNavigate } from 'react-router-dom';
//import { uploadimageData } from 'src/components/UI/ImagePicker';
export const useUpdateUser = () => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { fetchData } = useFetch();
  const createUpdateUser = async (body) => {
   console.log(body,'user register body');
    return new Promise((resolve) => {
      fetchData('/BlazorApi/updateuser', { method: 'POST', body: JSON.stringify(body) }, (res) => {
        resolve(res);
        if (res.status) {
       // alert(JSON.stringify(res));
          //showToast(res.message);
          showToast(res.message);
         // uploadimageData();
        } else {
          showToast(res.message, 'error');
        }
      });
    });
  };
  
  return { createUpdateUser };
};
