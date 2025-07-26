import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';
import { useNavigate } from 'react-router-dom';
//import { uploadimageData } from 'src/components/UI/ImagePicker';
export const createSchedule = () => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { fetchData } = useFetch();
  const createScheduledata = async (body) => {
    //  alert(JSON.stringify(body));comment


    return new Promise((resolve) => {
      fetchData('/Compaigns/submitcompaign', { method: 'POST', body: JSON.stringify(body) }, (res) => {
        resolve(res);
        if (res.status) {
          //console.log(res, 'submitres');
          //showToast(res.message);
          showToast(res.message);
          // uploadimageData();
        } else {
          showToast(res.message, 'error');
        }
      });
    });
  };

  return { createScheduledata };
};
