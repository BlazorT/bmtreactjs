import moment from 'moment';
import { useSelector } from 'react-redux';
import { useShowToast } from '../useShowToast';
import useApi from '../useApi';

export const useFetchCampaigns = () => {
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/Compaigns/detailedcompaigns');

  const fetchCompaigns = async (filters) => {
   // alert(JSON.stringify(filters));
    const compaignsBody = {
      id: 0,       
      orgId: filters ? filters.orgId : 0, 
      rowVer: filters ? filters.rowVer : 0 ,
      networkId: filters ? filters.networkId:0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,  
      createdAt: filters
        ? moment(filters.createdAt).utc().format('YYYY-MM-DD')
        : moment().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? moment(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : moment().utc().format(),
    };
   
   // console.log(userBody,'body')
    const res = await postData(compaignsBody);
    console.log(( res),'campaignData' );
   // alert((res.data.status) );
    if (res && res.status) {
      return res.data;
    } else if (res) {
      showToast(res.message, 'error');
      return [];
    }
    return [];
  };

  return { data, error, loading, fetchCompaigns };
};
