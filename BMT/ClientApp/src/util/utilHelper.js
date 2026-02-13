import globalutil from './globalutil';

export const addGlobalUtils = (data) => {
  globalutil.setnetworks(data.networks);
  globalutil.setstates(data.states);
  globalutil.setstatuses(data.statuses);
  globalutil.setintervals(data.intervals);
  globalutil.setcountries(data.countries);
  globalutil.setcategories(data.categories);
  globalutil.setalerts(data.alerts);
  globalutil.setpackages(data.packages);
  globalutil.setCurrencies(data.currencies);
  globalutil.setPostTypes(data.postTypes);
  globalutil.setmenus(data.menus);
  globalutil.setservicetypes(data.servicetypes);
  globalutil.setcommonstatuses(data.commonstatuses);
  globalutil.setauditentities(data.auditentities);
  globalutil.setuserroles(data.userroles);
  globalutil.setbusinessentitiess(data.businessentities);
  globalutil.setbusinesstypes(data.businesstypes);
  globalutil.setdeliverstatus(data.deliverstatus);
  globalutil.setcampaignunits(data.campaignunits);
};
