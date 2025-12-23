/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react';

import * as CoreUIIcons from '@coreui/icons';

import { CNavGroup, CNavItem } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const getIcon = (iconName) => {
  return CoreUIIcons?.[iconName] || CoreUIIcons.cilCircle;
};

export const mapNavItem = (data) => {
  const navigate = useNavigate();
  return data.map((item) => {
    return {
      component: item.component === 'CNavGroup' ? CNavGroup : CNavItem,
      name: item.name,
      to: item.to,
      icon: item.icon ? <CIcon icon={getIcon(item.icon)} customClassName="nav-icon" /> : null,
      badge: item.badge ? { color: item.badge.color, text: item.badge.text } : null,
      items:
        item.items.length > 0
          ? item.items.map((subItem) => {
              return {
                component: CNavItem,
                name: subItem.name,
                to: subItem.to,
                onClick: () => navigate(subItem.to?.includes('/') ? subItem.to : '/' + subItem.to),
                className: 'group-nav-items',
                icon: subItem.icon ? (
                  <CIcon icon={getIcon(subItem.icon)} customClassName="nav-icon" />
                ) : null,
                badge: subItem.badge
                  ? { color: subItem.badge.color, text: subItem.badge.text }
                  : null,
              };
            })
          : null,
      href: item.href ? item.href : null,
      onClick: () => (item?.to === 'Dashboard' ? navigate('/' + item.to) : undefined),
    };
  });
};
