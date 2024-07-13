/* eslint-disable prettier/prettier */
import React from 'react';
import CIcon from '@coreui/icons-react';

import {
  cilBell,
  cilTruck,
  cilAddressBook,
  cilTask,
  cilLibraryAdd,
  cilNoteAdd,
  cilPeople,
  cilUser,
  cilCalculator,
  cilClipboard,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilChart,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilBadge,
  cilUserPlus,
  cilStar,
  cilSettings,
  cilExcerpt,
  cilLibrary,
  cilCarAlt,
  cilFactory,
  cilListRich,
  cilSitemap,
  cilFile,
  cilList,
  cilFork,
  cilListLowPriority,
  cilRuble,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'cilBell':
      return cilBell;
    case 'cilAddressBook':
      return cilAddressBook;
    case 'cilTruck':
      return cilTruck;
    case 'cilUserPlus':
      return cilUserPlus;
    case 'cilLibraryAdd':
      return cilLibraryAdd;
    case 'cilBadge':
      return cilBadge;
    case 'cilNoteAdd':
      return cilNoteAdd;
    case 'cilPeople':
      return cilPeople;
    case 'cilTask':
      return cilTask;
    case 'cilChart':
      return cilChart;
    case 'cilUser':
      return cilUser;
    case 'cilCalculator':
      return cilCalculator;
    case 'cilChartPie':
      return cilChartPie;
    case 'cilCursor':
      return cilCursor;
    case 'cilDescription':
      return cilDescription;
    case 'cilDrop':
      return cilDrop;
    case 'cilNotes':
      return cilNotes;
    case 'cilPencil':
      return cilPencil;
    case 'cilPuzzle':
      return cilPuzzle;
    case 'cilSpeedometer':
      return cilSpeedometer;
    case 'cilClipboard':
      return cilClipboard;
    case 'cilExcerpt':
      return cilExcerpt;
    case 'cilSettings':
      return cilSettings;
    case 'cilLibrary':
      return cilLibrary;
    case 'cilCarAlt':
      return cilCarAlt;
    case 'cilFactory':
      return cilFactory;
    case 'cilListRich':
      return cilListRich;
    case 'cilFile':
      return cilFile;
    case 'cilSitemap':
      return cilSitemap;
    case 'cilList':
      return cilList;
    case 'cilFork':
      return cilFork;
    case 'cilListLowPriority':
      return cilListLowPriority;
    case 'cilRuble':
      return cilRuble;
    default:
      return null;
  }
};

export const mapNavItem = (data) => {
  console.log(data)
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
    };
  });
};
