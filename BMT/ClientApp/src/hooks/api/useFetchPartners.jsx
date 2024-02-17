import useFetch from '../useFetch';
import { useShowToast } from '../useShowToast';

export const useFetchPartners = () => {
  const showToast = useShowToast();
  const { fetchData } = useFetch();

  const fetchPartners = async (id) => {
    const fetchBody = {
      fullName: '',
      businessName: '',
      dspid: id.toString(),
      email: '',
      dob: '',
      primaryContact: '',
      decisionMakingAuthority: '',
      status: '0',
    };

    return new Promise((resolve) => {
      fetchData(
        '/BlazorApi/dspspartners',
        {
          method: 'POST',
          body: JSON.stringify(fetchBody),
        },
        (res) => {
          if (res.status) {
            resolve(res.data);
          } else {
            showToast(res.message, 'error');
            resolve([]);
          }
        },
      );
    });
  };

  return { fetchPartners };
};
