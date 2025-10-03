import React, { useState } from 'react';

import { cilChevronBottom } from '@coreui/icons';
import LineCharCard from 'src/components/Cards/LineCharCard';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';

import AppContainer from 'src/components/UI/AppContainer';

const Dashboard = (prop) => {
  //const [operationsVisible, setOperationVisible] = useState(true);
  //const [peopleVisible, setPeopleVisible] = useState(true);
  const [showFilters, setshowFilters] = useState(false);

  // const user = useSelector((state) => state.user);
  //const { title, attributesStatus2, attributesStatus3 } = prop;
  const [vehDisprows, setVehDispRow] = useState([
    {
      id: 1,
      month: 'January',
      totalCampaigns: '34',
      newCampaigns: '10',
      totalFunds: '20',
      increase: '50%',
    },
    {
      id: 2,
      month: 'Febraury',
      totalCampaigns: '34',
      newCampaigns: '10',
      totalFunds: '2000',
      increase: '40%',
    },
    {
      id: 3,
      month: 'March',
      totalCampaigns: '34',
      newCampaigns: '10',
      totalFunds: '40000',
      increase: '60%',
    },
    {
      id: 4,
      month: 'April',
      totalCampaigns: '34',
      newCampaigns: '10',
      totalFunds: '1000',
      increase: '70%',
    },
  ]);

  const [vehDispcolumns, setVehDispcolumns] = useState([
    {
      key: 'month',
      headerClassName: 'custom-header-data-grid',
      minWidth: 100,
      // maxWidth:180,
      flex: 1,
      name: 'Month',
      editable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      key: 'totalCampaigns',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      // maxWidth:180,
      flex: 1,
      editable: false,
      name: 'Total Campaigns',
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      key: 'newCampaigns',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      name: 'New Campaigns',
      editable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      key: 'totalFunds',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      name: 'Total Funds',
      editable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      key: 'increase',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      name: 'Increase(%)',
      editable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
  ]);
  const toggleStock = () => {
    setshowFilters((prev) => !prev);
  };
  return (
    <>
      <div className="p-w-md m-t-sm">
        <div className="row white">
          <div className="col-sm-4">
            <div className="row m-t-xs">
              <div className="col-6">
                <h4 className="m-b-xs">Notifications (Month)</h4>
                <h1 className="no-margins" id="lblPlanCurrentMonth"></h1>
                <div className="font-bold text-navy">
                  <span id="lblPlanCurrentMonthPerc">25 % </span>&nbsp;
                  <i className="fa fa-bolt"></i>
                </div>
              </div>
              <div className="col-6">
                <h4 className="m-b-xs">Funds (Month)</h4>
                <h1 className="no-margins" id="lblFundsCurrentMonth"></h1>
                <div className="font-bold text-navy">
                  <span id="lblFundsCurrentMonthPerc">20 % </span>&nbsp;
                  <i className="fa fa-bolt"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <h1 id="" className="m-b-xs"></h1>
            <small></small>
            <div id="sparkline1" className="m-b-sm"></div>
            <div className="row">
              <div className="col-6">
                <small className="stats-label"></small>
                <h4 id=""></h4>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="row m-t-xs">
              <div className="col-6">
                <h4 className="m-b-xs">Notifications (Year)</h4>
                <h1 className="no-margins" id="lblPlanCurrentYear"></h1>
                <div className="font-bold text-navy">
                  100 % <i className="fa fa-bolt"></i>
                </div>
              </div>
              <div className="col-6">
                <h4 className="m-b-xs">Funds (Year)</h4>
                <h1 className="no-margins" id="lblFundsCurrentYear"></h1>
                <div className="font-bold text-navy">
                  100 % <i className="fa fa-bolt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <LineCharCard />
          {/*  <canvas id="flot-dashboard5-chart" width="600" height="120"></canvas>*/}
        </div>
      </div>

      <AppContainer>
        <DataGridHeader
          title="Last 12 Month Funds Data"
          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
          filterDisable={true}
        />
        {showFilters && (
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-content DashboardGrid">
                  {/*<div className="row">*/}
                  {/*  <h3 className="txtFont">Last 12 Month Funds Data</h3>*/}
                  {/*</div>*/}
                  <div className="row">
                    <div className="bg_Div mb-2 d-flex flex-column">
                      <DataGridHeader title="Campaign Report" />
                      <div className="show-stock">
                        <div className="row ">
                          <div className="col-md-12 col-xl-12">
                            <CustomDatagrid
                              rows={vehDisprows}
                              columns={vehDispcolumns}
                              rowHeight={55}
                              pagination={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*<table className="table ibox-content DashboardGrid table-striped" id="DashboardTable">*/}
                    {/*  <thead >*/}
                    {/*    <tr className="white">*/}
                    {/*      <th scope="col" >Month</th>*/}
                    {/*      <th scope="col">Total Compaigns</th>*/}
                    {/*      <th scope="col">New Compaigns</th>*/}
                    {/*      <th scope="col">Total Funds</th>*/}
                    {/*      <th scope="col">Increase  (%)</th>*/}
                    {/*    </tr>*/}
                    {/*  </thead>*/}
                    {/*  <tbody id="gridBody" className="white" >*/}
                    {/*  </tbody>*/}
                    {/*</table>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppContainer>
    </>
  );
};

export default Dashboard;
