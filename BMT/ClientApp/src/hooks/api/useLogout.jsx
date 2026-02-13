import { useDispatch, useSelector } from 'react-redux';
import { setNavItems } from 'src/redux/navItems/navItemsSlice';
import { logout as userLogOut } from 'src/redux/user/userSlice';
import useApi from '../useApi';
import { persistor } from 'src/store';

export const useLogout = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    data: logoutData,
    loading: logoutLoading,
    error: logoutErr,
    postData,
  } = useApi(`/Common/logout?id=${user?.userId}`);

  const logout = async () => {
    await postData();

    dispatch(userLogOut());
    dispatch(setNavItems([]));
    persistor.purge();
    window.location.href = `${window.location.origin}`;
  };

  return { logoutData, logoutLoading, logoutErr, logout };
};
