import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';

export const useShowToast = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showToast = (message: any, variant: string = 'success') => {
    dispatch(updateToast({ isToastOpen: true, toastMessage: message, toastVariant: variant }));
  };

  return showToast;
};
