import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';
export const createSchedule = () => {
  const showToast = useShowToast();
  const { fetchData } = useFetch();
  const createScheduledata = async (body) => {
    //  alert(JSON.stringify(body));comment

    return new Promise((resolve) => {
      fetchData(
        '/Compaigns/submitmycompaign',
        { method: 'POST', body: JSON.stringify(body) },
        (res) => {
          resolve(res);
          if (res.status) {
            //console.log(res, 'submitres');
            //showToast(res.message);
            showToast(res.message);
            // uploadimageData();
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    });
  };

  return { createScheduledata };
};
