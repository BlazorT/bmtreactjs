// usePageRoles.ts
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

const usePageRoles = (pageName: string) => {
  const allPageRoles = useSelector((state: RootState) => state.navItems.pageRoles);

  // Get current URL pathname (remove leading/trailing slashes)
  const currentPath = window.location.hash.replace('#', '').replace(/\//g, '').toLowerCase();

  const pageRoles = allPageRoles?.find((item) => {
    const actionName =
      typeof item.actionName === 'string' ? item.actionName.replace(/\//g, '').toLowerCase() : '';
    const itemName =
      typeof item.name === 'string' ? item.name.replace(/\//g, '').toLowerCase() : '';
    const passedName = pageName.replace(/\//g, '').toLowerCase();
    // 1️⃣ match URL with actionName
    if (currentPath === actionName) return true;

    // 2️⃣ fallback: match URL with item.name
    if (currentPath === itemName) return true;

    // 3️⃣ fallback: match passed pageName with item.name
    if (passedName === itemName) return true;

    return false;
  });

  return pageRoles;
};

export default usePageRoles;
