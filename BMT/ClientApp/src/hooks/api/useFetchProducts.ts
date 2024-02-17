import useApi, { ApiPostDataType } from '../useApi';
import { useShowToast } from '../useShowToast';

type Product = {
  shortCode?: string;
  businessEntityId?: number;
  categoryId?: number;
  lastUpdatedAt?: string;
  id: number;
  manufactureCountryId: number;
  groupId: number;
  name: string;
  status: number;
  rowVer: number;
  // Add other properties as needed
};

interface ProductResponse {
  status: boolean;
  data: Product[];
  message?: string;
}

export const useFetchProducts = () => {
  const showToast = useShowToast();

  const { data, error, loading, postData } = useApi('/BlazorApi/products');

  const fetchProducts = async (): Promise<Product[] | []> => {
    const productBody: Product = {
      id: 0,
      manufactureCountryId: 0,
      groupId: 0,
      name: '',
      status: 0,
      rowVer: 0,
    };

    const res = (await postData(productBody)) as ProductResponse;

    if (res.status === true) {
      return res.data;
    } else {
      showToast(res.message, 'error');
      return [];
    }
  };

  return { data, error, loading, fetchProducts };
};
