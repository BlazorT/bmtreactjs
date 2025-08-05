/* eslint-disable */

export default class globalutil {
  //makes
  static networks() {
    if (localStorage.getItem('networks') !== '' && localStorage.getItem('networks') !== null)
      return JSON.parse(localStorage.getItem('networks'));
    else return null;
  }
  static setnetworks(networks) {
    localStorage.setItem('networks', JSON.stringify(networks));
  }        
  static statuses() {
    if (
      localStorage.getItem('statuses') !== '' &&
      localStorage.getItem('statuses') !== null
    )
      return JSON.parse(localStorage.getItem('statuses'));
    else return null;
  }
  static setstatuses(statuses) {
    localStorage.setItem('statuses', JSON.stringify(statuses));
  }
  static intervals() {
    if (localStorage.getItem('intervals') !== '' && localStorage.getItem('intervals') !== null)
      return JSON.parse(localStorage.getItem('intervals'));
    else return null;
  }
  static setintervals(intervals) {
    localStorage.setItem('intervals', JSON.stringify(intervals));
  }
  //business types
  static notificationtypes() {
    if (
      localStorage.getItem('notificationtypes') !== '' &&
      localStorage.getItem('notificationtypes') !== null
    )
      return JSON.parse(localStorage.getItem('notificationtypes'));
    else return null;
  }
  // Alerts
  static setalerts(alerts) {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }
  static alerts() {
    if (localStorage.getItem('alerts') !== '' && localStorage.getItem('alerts') !== null)
      return JSON.parse(localStorage.getItem('alerts'));
    else return null;
  }
  //notifications
  static setnotifications(notifications) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } 
  static notifications() {
    if (
      localStorage.getItem('notifications') !== '' &&
      localStorage.getItem('notifications') !== null
    )
      return JSON.parse(localStorage.getItem('notifications'));
    else return null;
  }
  //Packages
  static setpackages(packages) {
    localStorage.setItem('packages', JSON.stringify(packages));
  }
  static packages() {
    if (
      localStorage.getItem('packages') !== '' &&
      localStorage.getItem('packages') !== null
    )
      return JSON.parse(localStorage.getItem('packages'));
    else return null;
  }
  // Currencies
  static setCurrencies(currencies) {
    localStorage.setItem('currencies', JSON.stringify(currencies));
  }
  static currencies() {
    if (
      localStorage.getItem('currencies') !== '' &&
      localStorage.getItem('currencies') !== null
    )
      return JSON.parse(localStorage.getItem('currencies'));
    else return null;
  }
  //Post Types
  static setPostTypes(postTypes) {
    localStorage.setItem('postTypes', JSON.stringify(postTypes));
  }

  //PostTypes
  static postTypes() {
    if (localStorage.getItem('postTypes') !== '' && localStorage.getItem('postTypes') !== null)
      return JSON.parse(localStorage.getItem('postTypes'));
    else return null;
  }
  //states
  static states() {
    
    if (localStorage.getItem('states') !== '' && localStorage.getItem('states') !== null)
      return JSON.parse(localStorage.getItem('states'));
    else return null;
  }
  static setstates(states) {
    localStorage.setItem('states', JSON.stringify(states));
  }
    //intervaltypes
  static servicetypes() {
    if (
      localStorage.getItem('servicetypes') !== '' &&
      localStorage.getItem('servicetypes') !== null
    )
      return JSON.parse(localStorage.getItem('servicetypes'));
    else return null;
  }
  static setservicetypes(servicetypes) {
    localStorage.setItem('servicetypes', JSON.stringify(servicetypes));
  }
  //setstatuses

  static commonstatuses() {
    if (
      localStorage.getItem('commonstatuses') !== '' &&
      localStorage.getItem('commonstatuses') !== null
    )
      return JSON.parse(localStorage.getItem('commonstatuses'));
    else return null;
  }
  static setcommonstatuses(statuses) {
    if (statuses !== null && statuses !== undefined)
    localStorage.setItem('commonstatuses', JSON.stringify(statuses));
  }
  //setstatuses
  static auditentities() {
    if (
      localStorage.getItem('auditentities') !== '' &&
      localStorage.getItem('auditentities') !== null
    )
      return JSON.parse(localStorage.getItem('auditentities'));
    else return null;
  }
  static setauditentities(auditentities) {
    localStorage.setItem('auditentities', JSON.stringify(auditentities));
  }
  //Categories
  static categories() {
    if (localStorage.getItem('categories') !== '' && localStorage.getItem('categories') !== null)
      return JSON.parse(localStorage.getItem('categories'));
    else return null;
  }
  static setcategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
  }
  //user roles
  static userroles() {
    if (localStorage.getItem('userroles') !== '' && localStorage.getItem('userroles') !== null)
      return JSON.parse(localStorage.getItem('userroles'));
    else return null;
  }
  static setuserroles(userroles) {
    localStorage.setItem('userroles', JSON.stringify(userroles));
  }
  
  //MENUS
  static menus() {
    if (localStorage.getItem('menus') !== '' && localStorage.getItem('menus') !== null)
      return JSON.parse(localStorage.getItem('menus'));
    else return null;
  }
  static setmenus(menus) {
    localStorage.setItem('menus', JSON.stringify(menus));
  }
  //deliverstatus
  static deliverstatus() {
    if (localStorage.getItem('deliverstatus') !== '' && localStorage.getItem('deliverstatus') !== null)
      return JSON.parse(localStorage.getItem('deliverstatus'));
    else return null;
  }
  static setdeliverstatus(deliverstatus) {
    localStorage.setItem('deliverstatus', JSON.stringify(deliverstatus));
  }

  static businessentitiess() {
    if (localStorage.getItem('businessentitiess') !== '' && localStorage.getItem('businessentitiess') !== null)
      return JSON.parse(localStorage.getItem('businessentitiess'));
    else return null;
  }
  static setbusinessentitiess(businessentitiess) {
    localStorage.setItem('businessentitiess', JSON.stringify(businessentitiess));
  }
  static businesstypes() {
    if (localStorage.getItem('businesstypes') !== '' && localStorage.getItem('businesstypes') !== null)
      return JSON.parse(localStorage.getItem('businesstypes'));
    else return null;
  }
  static setbusinesstypes(businesstypes) {
    localStorage.setItem('businesstypes', JSON.stringify(businesstypes));
  }
  static countries() {
    if (localStorage.getItem('countries') !== '' && localStorage.getItem('countries') !== null)
      return JSON.parse(localStorage.getItem('countries'));
    else return null;
  }
  static setcountries(countries) {
    localStorage.setItem('countries', JSON.stringify(countries));
  }
  
}
