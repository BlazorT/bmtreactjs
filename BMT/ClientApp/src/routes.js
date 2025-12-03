import React from 'react';

const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const OrganizationAdd = React.lazy(() => import('./pages/DA/organizationadd'));
const Packages = React.lazy(() => import('./pages/Admin/Packages'));
const GlobalTemplates = React.lazy(() => import('./pages/Admin/GlobalTemplates'));
const pricing = React.lazy(() => import('./pages/Admin/pricing'));
const BmtRoles = React.lazy(() => import('./pages/Admin/bmtRoles'));
const RecipientsGrid = React.lazy(() => import('./pages/Admin/recipientsGrid'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const campaignadd = React.lazy(() => import('./pages/DA/campaignadd'));
const Notification = React.lazy(() => import('./pages/Notification/Notification'));
const networksetting = React.lazy(() => import('./pages/Admin/networksetting'));
const globalpreference = React.lazy(() => import('./pages/Admin/globalpreference'));
const organizationsusers = React.lazy(() => import('./pages/DA/organizationsusers'));
const campaignslisting = React.lazy(() => import('./pages/DA/campaignslisting'));
const CampaignContacts = React.lazy(() => import('./pages/DA/campaignContacts'));
const CampaignNotification = React.lazy(() => import('./pages/Reports/campaignNotification'));
const UserRegister = React.lazy(() => import('./pages/Admin/UserRegister'));
const Logs = React.lazy(() => import('./pages/Reports/Logs'));
const UserReport = React.lazy(() => import('./pages/Reports/UserReport'));
const organizationreport = React.lazy(() => import('./pages/Reports/organizationreport'));
const AuditLogs = React.lazy(() => import('./pages/Reports/AuditLogs'));
const Users = React.lazy(() => import('./pages/Admin/Users'));
const Organizations = React.lazy(() => import('./pages/Admin/Organizations'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));

export const rolesRoutes = [
  { path: 'Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Users', name: 'Users', element: Users },
  { path: 'globaltemplate', name: 'GlobalTemplates', element: GlobalTemplates },
  { path: '/Organizations', name: 'Organizations', element: Organizations },
  { path: '/Logs', name: 'ApplyForm', element: Logs },
  { path: '/Notification', name: 'Notification', element: Notification },
  { path: '/Packages', name: 'Packages', element: Packages },
  { path: '/pricing', name: 'pricing', element: pricing },
  { path: '/networksetting', name: 'networksetting', element: networksetting },
  { path: '/globalpreference', name: 'globalpreference', element: globalpreference },
  { path: '/AuditLogs', name: 'AuditLogs', element: AuditLogs },
  { path: '/UserReport', name: 'UserReport', element: UserReport },
  { path: '/campaignadd', name: 'campaignadd', element: campaignadd },
  { path: '/organizationreport', name: 'organizationreport', element: organizationreport },
  { path: '/organizationsusers', name: 'organizationsusers', element: organizationsusers },
  { path: '/campaignslisting', name: 'Delivery', element: campaignslisting },
];

export const routes = [
  { path: '/home', exact: true, name: 'Home' },
  { path: '/campaignadd', name: 'campaignadd', element: campaignadd },
  { path: '/organizationadd', name: 'organizationadd', element: OrganizationAdd },
  { path: '/UserRegister', name: 'UserRegister', element: UserRegister },
  { path: '/PrivacyPolicy', name: 'PrivacyPolicy', element: PrivacyPolicy },
  { path: '/AuditLogs', name: 'AuditLogs', element: AuditLogs },
  { path: '/UserReport', name: 'UserReport', element: UserReport },
  { path: '/pricing', name: 'pricing', element: pricing },
  { path: '/bmtRoles', name: 'bmtRoles', element: BmtRoles },
  { path: '/recipientsGrid', name: 'recipientsGrid', element: RecipientsGrid },
  { path: '/Packages', name: 'Packages', element: Packages },
  { path: '/Users', name: 'Users', element: Users },
  { path: '/Organizations', name: 'Organizations', element: Organizations },
  { path: '/networksetting', name: 'networksetting', element: networksetting },
  { path: '/globalpreference', name: 'globalpreference', element: globalpreference },
  { path: '/campaignslisting', name: 'campaignslisting', element: campaignslisting },
  { path: '/campaignContacts', name: 'campaignContacts', element: CampaignContacts },
  { path: '/campaignadd', name: 'campaignadd', element: campaignadd },
  { path: '/organizationsusers', name: 'organizationsusers', element: organizationsusers },
  { path: '/campaignNotification', name: 'campaignNotification', element: CampaignNotification },
  { path: '/Logs', name: 'Logs', element: Logs },
  { path: '/AuditLogs', name: 'AuditLogs', element: AuditLogs },
  { path: '/organizationreport', name: 'organizationreport', element: organizationreport },
  { path: '/UserReport', name: 'UserReport', element: UserReport },
  '',
];
