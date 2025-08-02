// usePageRoles.ts
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

const usePageRoles = (pageName: string) => {
  const pageRoles = useSelector((state: RootState) => state.navItems.pageRoles).find(
    (item) => item.name === pageName,
  );
  const roles = useSelector((state: RootState) => state.navItems)
 // console.log(roles)
  return pageRoles;
};

export default usePageRoles;
