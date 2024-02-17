/* eslint-disable */

export default class globalutil {
  //makes
  static makes() {
    if (localStorage.getItem('makes') !== '' && localStorage.getItem('makes') !== null)
      return JSON.parse(localStorage.getItem('makes'));
    else return null;
  }
  static setmakes(makes) {
    localStorage.setItem('makes', JSON.stringify(makes));
  }
  static synchstatuses() {
    if (
      localStorage.getItem('synchstatuses') !== '' &&
      localStorage.getItem('synchstatuses') !== null
    )
      return JSON.parse(localStorage.getItem('synchstatuses'));
    else return null;
  }
  static setsynchstatuses(synchstatuses) {
    localStorage.setItem('synchstatuses', JSON.stringify(synchstatuses));
  }
  static rostertypes() {
    if (localStorage.getItem('rostertypes') !== '' && localStorage.getItem('rostertypes') !== null)
      return JSON.parse(localStorage.getItem('rostertypes'));
    else return null;
  }
  static setrostertypes(rostertypes) {
    localStorage.setItem('rostertypes', JSON.stringify(rostertypes));
  }
  static product_assignment_types() {
    if (
      localStorage.getItem('product_assignment_types') !== '' &&
      localStorage.getItem('product_assignment_types') !== null
    )
      return JSON.parse(localStorage.getItem('product_assignment_types'));
    else return null;
  }
  static setproduct_assignment_types(product_assignment_types) {
    localStorage.setItem('product_assignment_types', JSON.stringify(product_assignment_types));
  }
  static datatypes() {
    if (localStorage.getItem('datatypes') !== '' && localStorage.getItem('datatypes') !== null)
      return JSON.parse(localStorage.getItem('datatypes'));
    else return null;
  }
  static setdatatypes(datatypes) {
    localStorage.setItem('datatypes', JSON.stringify(datatypes));
  }
  static dsP_TABLES() {
    if (localStorage.getItem('dsP_TABLES') !== '' && localStorage.getItem('dsP_TABLES') !== null)
      return JSON.parse(localStorage.getItem('dsP_TABLES'));
    else return null;
  }
  static setdsP_TABLES(dsP_TABLES) {
    localStorage.setItem('dsP_TABLES', JSON.stringify(dsP_TABLES));
  }
  static fieldtypes() {
    if (localStorage.getItem('fieldtypes') !== '' && localStorage.getItem('fieldtypes') !== null)
      return JSON.parse(localStorage.getItem('fieldtypes'));
    else return null;
  }
  static setfieldtypes(fieldtypes) {
    localStorage.setItem('fieldtypes', JSON.stringify(fieldtypes));
  }
  //business types
  static businesstypes() {
    if (
      localStorage.getItem('businesstypes') !== '' &&
      localStorage.getItem('businesstypes') !== null
    )
      return JSON.parse(localStorage.getItem('businesstypes'));
    else return null;
  }
  static setbusinesstypes(businesstypes) {
    localStorage.setItem('businesstypes', JSON.stringify(businesstypes));
  }
  //substatuses
  static substatuses() {
    if (localStorage.getItem('substatuses') !== '' && localStorage.getItem('substatuses') !== null)
      return JSON.parse(localStorage.getItem('substatuses'));
    else return null;
  }
  static setsubstatuses(substatuses) {
    localStorage.setItem('substatuses', JSON.stringify(substatuses));
  }
  static vehiclestatuss() {
    if (
      localStorage.getItem('vehiclestatuss') !== '' &&
      localStorage.getItem('vehiclestatuss') !== null
    )
      return JSON.parse(localStorage.getItem('vehiclestatuss'));
    else return null;
  }
  static setvehiclestatuss(vehiclestatuss) {
    localStorage.setItem('vehiclestatuss', JSON.stringify(vehiclestatuss));
  }
  //servicetypes
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
  //business entities details
  static businessentities() {
    if (
      localStorage.getItem('businessentities') !== '' &&
      localStorage.getItem('businessentities') !== null
    )
      return JSON.parse(localStorage.getItem('businessentities'));
    else return null;
  }
  static setbusinessentities(businessentities) {
    localStorage.setItem('businessentities', JSON.stringify(businessentities));
  }
  //notificationtypes
  static notificationtypes() {
    if (
      localStorage.getItem('notificationtypes') !== '' &&
      localStorage.getItem('notificationtypes') !== null
    )
      return JSON.parse(localStorage.getItem('notificationtypes'));
    else return null;
  }
  static setnotificationtypes(notificationtypes) {
    localStorage.setItem('notificationtypes', JSON.stringify(notificationtypes));
  }

  //countries
  static countries() {
    if (localStorage.getItem('countries') !== '' && localStorage.getItem('countries') !== null)
      return JSON.parse(localStorage.getItem('countries'));
    else return null;
  }
  static setcountries(countries) {
    localStorage.setItem('countries', JSON.stringify(countries));
  }

  //vehicletypes
  static vehicletypes() {
    if (
      localStorage.getItem('vehicletypes') !== '' &&
      localStorage.getItem('vehicletypes') !== null
    )
      return JSON.parse(localStorage.getItem('vehicletypes'));
    else return null;
  }
  static setvehicletypes(vehicletypes) {
    localStorage.setItem('vehicletypes', JSON.stringify(vehicletypes));
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

  //productgroups
  static productGroup() {
    if (
      localStorage.getItem('productGroup') !== '' &&
      localStorage.getItem('productGroup') !== null
    )
      return JSON.parse(localStorage.getItem('productGroup'));
    else return null;
  }

  static setproductgroups(productGroup) {
    localStorage.setItem('productGroup', JSON.stringify(productGroup));
  }
  ////packages
  //static packages() {
  //    if (localStorage.getItem("packages") !== '' && localStorage.getItem("packages") !== null)
  //        return JSON.parse(localStorage.getItem("packages"))
  //    else
  //        return null;
  //};
  //static setpackages(packages) { localStorage.setItem("packages", JSON.stringify(packages)) };
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
  static dastatuses() {
    if (localStorage.getItem('dastatuses') !== '' && localStorage.getItem('dastatuses') !== null)
      return JSON.parse(localStorage.getItem('dastatuses'));
    else return null;
  }
  static setdastatuses(statuses) {
    localStorage.setItem('dastatuses', JSON.stringify(statuses));
  }
  static commonstatuses() {
    if (
      localStorage.getItem('dastacommonstatusestuses') !== '' &&
      localStorage.getItem('commonstatuses') !== null
    )
      return JSON.parse(localStorage.getItem('commonstatuses'));
    else return null;
  }
  static setcommonstatuses(statuses) {
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
  //Inspection Status
  static inspectionstatuses() {
    if (
      localStorage.getItem('inspectionstatuses') !== '' &&
      localStorage.getItem('inspectionstatuses') !== null
    )
      return JSON.parse(localStorage.getItem('inspectionstatuses'));
    else return null;
  }
  static setinspectionstatuses(inspectionstatuses) {
    localStorage.setItem('inspectionstatuses', JSON.stringify(inspectionstatuses));
  }
  static inspectionitems() {
    if (
      localStorage.getItem('inspectionitems') !== '' &&
      localStorage.getItem('inspectionitems') !== null
    )
      return JSON.parse(localStorage.getItem('inspectionitems'));
    else return null;
  }
  static setinspectionitems(inspectionitems) {
    localStorage.setItem('inspectionitems', JSON.stringify(inspectionitems));
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

  //ownerships
  static ownerships() {
    if (localStorage.getItem('ownerships') !== '' && localStorage.getItem('ownerships') !== null)
      return JSON.parse(localStorage.getItem('ownerships'));
    else return null;
  }
  static setownerships(ownerships) {
    localStorage.setItem('ownerships', JSON.stringify(ownerships));
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

  // ROSTER
  static rostertypes() {
    if (localStorage.getItem('rostertypes') !== '' && localStorage.getItem('rostertypes') !== null)
      return JSON.parse(localStorage.getItem('rostertypes'));
    else return null;
  }
  static setrostertypes(rtypes) {
    localStorage.setItem('rostertypes', JSON.stringify(rtypes));
  }
  // SYNCH
  static synchstatuses() {
    if (
      localStorage.getItem('synchstatuses') !== '' &&
      localStorage.getItem('synchstatuses') !== null
    )
      return JSON.parse(localStorage.getItem('synchstatuses'));
    else return null;
  }
  static setsynchstatuses(sstatues) {
    localStorage.setItem('synchstatuses', JSON.stringify(sstatues));
  }
}
