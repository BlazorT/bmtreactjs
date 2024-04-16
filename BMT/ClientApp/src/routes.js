import React from 'react';

const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
//const DADashboard = React.lazy(() => import('./pages/Dashboard/DADashboard'));
const organizationadd = React.lazy(() => import('./pages/DA/organizationadd'));
/*const AddDA = React.lazy(() => import('./pages/DA/AddDA'));*/
//const FleetDashboard = React.lazy(() => import('./pages/Dashboard/FleetDashboard'));
const Packages = React.lazy(() => import('./pages/Admin/Packages'));
const pricing = React.lazy(() => import('./pages/Admin/pricing'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
//const DADspRegister = React.lazy(() => import('./pages/DA/DADspRegister'));
const campaignadd = React.lazy(() => import('./pages/DA/campaignadd'));
//const DADspsList = React.lazy(() => import('./pages/DA/DADspsList'));
//const WorkFlow = React.lazy(() => import('./pages/Workflow/WorkFlowList'));
const Notification = React.lazy(() => import('./pages/Notification/Notification'));
const networksetting = React.lazy(() => import('./pages/Admin/networksetting'));
const globalpreference = React.lazy(() => import('./pages/Admin/globalpreference'));
//const Expression = React.lazy(() => import('./pages/Other/ExpressionForm'));
const organizationsusers = React.lazy(() => import('./pages/DA/organizationsusers'));
const campaignslisting = React.lazy(() => import('./pages/DA/campaignslisting'));
const waves = React.lazy(() => import('./pages/DA/Wave'));
//const waves = React.lazy(() => import('./pages/DA/Waves'));
//const Dispatchment = React.lazy(() => import('./pages/DA/Dispatchment'));
//const DailyRoster = React.lazy(() => import('./pages/DA/DailyRoster'));
const DSPSRoles = React.lazy(() => import('./pages/Admin/DSPSRoles'));
//const WorkFlowTask = React.lazy(() => import('./pages/Workflow/WorkFlowTask'));
//const ServiceIntegrated = React.lazy(() => import('./pages/Fleet/FleetServiceIntegrated'));
//const InventoryManagement = React.lazy(() => import('./pages/Inventory/InventoryManagement'));
//const WorkFlowSubTask = React.lazy(() => import('./pages/Workflow/WorkFlowSubTask'));
//const WorkFlowFieldMapping = React.lazy(() => import('./pages/Workflow/WorkFlowFieldMapping'));
const UserRegister = React.lazy(() => import('./pages/Admin/UserRegister'));
const GlobalPrefrences = React.lazy(() => import('./pages/Admin/GlobalPrefrences'));
const Logs = React.lazy(() => import('./pages/Reports/Logs'));
const UserReport = React.lazy(() => import('./pages/Reports/UserReport'));
//const DailyPerformanceReport = React.lazy(() => import('./pages/Reports/DailyPerformanceReport'));
//const DispatchmentReport = React.lazy(() => import('./pages/Reports/DispatchmentReport'));
//const rosterReport = React.lazy(() => import('./pages/Reports/RosterReport'));
const organizationreport = React.lazy(() => import('./pages/Reports/organizationreport'));
const AuditLogs = React.lazy(() => import('./pages/Reports/AuditLogs'));
const Users = React.lazy(() => import('./pages/Admin/Users'));
const Organizations = React.lazy(() => import('./pages/Admin/Organizations'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));

// Base
const Print = React.lazy(() => import('./components/ModalWindow/PrintInvoice'));
/*const PaymentDetail = React.lazy(() => import('./views/payments/paymentDetail'));*/
/*const PaymendAdd = React.lazy(() => import('./views/payments/paymentAdd'));*/
//const PlaceOrder = React.lazy(() => import('./views/salerecord/PlaceOrder'));
/*const Salerecord = React.lazy(() => import('./views/salerecord/SaleRecord'));*/
//const Newsale = React.lazy(() => import('./views/newsale/newsale'));
//const StockRecord = React.lazy(() => import('./pages/Reports/Stockrecord'));
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'));
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'));
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const Progress = React.lazy(() => import('./views/base/progress/Progress'));
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'));
//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'));
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'));
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'));
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'));
const Layout = React.lazy(() => import('./views/forms/layout/Layout'));
const Range = React.lazy(() => import('./views/forms/range/Range'));
const Select = React.lazy(() => import('./views/forms/select/Select'));
const Validation = React.lazy(() => import('./views/forms/validation/Validation'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'));

const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

export const rolesRoutes = [
  { path: 'Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Users', name: 'Users', element: Users },
  { path: '/Organizations', name: 'Organizations', element: Organizations },
  { path: '/organizationadd', name: 'organizationadd', element: organizationadd },
  //{ path: '/AddDA', name: 'AddDA', element: AddDA },
  //{ path: '/DADashboard', name: 'DADashboard', element: DADashboard },
  { path: '/Logs', name: 'ApplyForm', element: Logs },
  //{ path: '/DspsList', name: 'DspsList', element: DADspsList },
 // { path: '/WorkFlow', name: 'WorkFlow', element: WorkFlow },
  { path: '/Notification', name: 'Notification', element: Notification },
  { path: '/Packages', name: 'Packages', element: Packages },
  { path: '/pricing', name: 'pricing', element: pricing },
  //{ path: '/WorkFlowFieldMapping', name: 'WorkFlowFieldMapping', element: WorkFlowFieldMapping },
  { path: '/networksetting', name: 'networksetting', element: networksetting },
  { path: '/globalpreference', name: 'globalpreference', element: globalpreference },
  // { path: '/Expression', name: 'Expression', element: Expression },
  { path: '/AuditLogs', name: 'AuditLogs', element: AuditLogs },
  { path: '/UserReport', name: 'UserReport', element: UserReport },
  //{ path: '/DispatchmentReport', name: 'DispatchmentReport', element: DispatchmentReport },
  //{
  //  path: '/DailyPerformanceReport',
  //  name: 'DailyPerformanceReport',
  //  element: DailyPerformanceReport,
  //},
  { path: '/organizationreport', name: 'organizationreport', element: organizationreport },
  { path: '/organizationsusers', name: 'organizationsusers', element: organizationsusers },
  { path: '/campaignslisting', name: 'Delivery', element: campaignslisting },
  { path: '/waves', name: 'waves', element: waves },
  //{ path: '/rosterReport', name: 'rosterReport', element: rosterReport },
  //{ path: '/Dispatchment', name: 'Delivery', element: Dispatchment },
  //{ path: '/Schedule', name: 'Schedule', element: DailyRoster },
  { path: '/DSPSRoles', name: 'DSPSRoles', element: DSPSRoles },
  //{ path: '/WorkFlowTask', name: 'WorkFlowTask', element: WorkFlowTask },
  //{ path: '/WorkFlowSubTask', name: 'WorkFlowSubTask', element: WorkFlowSubTask },
  //{ path: '/ServiceIntegrated', name: 'ServiceIntegrated', element: ServiceIntegrated },
  //{ path: '/InventoryManagement', name: 'InventoryManagement', element: InventoryManagement },
  { path: '/GlobalPrefrences', name: 'GlobalPrefrences', element: GlobalPrefrences },
  /*{ path: '/stock', name: 'Stock Detail', element: StockRecord },*/
];

export const routes = [
  { path: '/home', exact: true, name: 'Home' },
  //{ path: '/fleet-dashboard', name: 'FleetDashboard', element: FleetDashboard },
  { path: '/campaignadd', name: 'campaignadd', element: campaignadd },
  { path: '/organizationadd ', name: 'organizationadd', element: organizationadd },
  //{ path: '/dspRegister', name: 'DspRegister', element: DADspRegister },
  { path: '/UserRegister', name: 'UserRegister', element: UserRegister },
  { path: '/print', name: 'Print', element: Print },
  { path: '/PrivacyPolicy', name: 'PrivacyPolicy', element: PrivacyPolicy },
  { path: '/AuditLogs', name: 'AuditLogs', element: AuditLogs },
  { path: '/UserReport', name: 'UserReport', element: UserReport },
  /*{ path: '/DAReport', name: 'UserReport', element: DAReport },*/
  //{
  //  path: '/DailyPerformanceReport',
  //  name: 'DailyPerformanceReport',
  //  element: DailyPerformanceReport,
  //},
  //{ path: '/DispatchmentReport', name: 'DispatchmentReport', element: DispatchmentReport },
  //{ path: '/rosterReport', name: 'rosterReport', element: rosterReport },
  //{ path: '/DailyRoster', name: 'DailyRoaster', element: DailyRoster },
  //{ path: '/salerecord', name: 'Sales', element: Salerecord },
  //{ path: '/new-sale', name: 'New Sale', element: Newsale },
  //{ path: '/payment-Detail', name: 'Payment Detail', element: PaymentDetail },
  //{ path: '/add-payment', name: 'Add Payment', element: PaymendAdd },
  //{ path: '/addnew', name: 'Order', element: PlaceOrder },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
];
