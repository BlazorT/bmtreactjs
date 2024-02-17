import React, { useState } from 'react';

import { cilChevronBottom } from '@coreui/icons';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import globalutil from 'src/util/globalutil';
import Loading from 'src/components/UI/Loading';
import DspRolesCustomCell from 'src/components/DataGridCustomCells/DspRolesCustomCell';
import moment from 'moment';
import { formatDate } from 'src/helpers/formatDate';
import { useSelector } from 'react-redux';

const DSPSRoles = () => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Roles Settings',
  );

  const roles = globalutil.userroles();

  const [showLicence, setShowLicence] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(
    roles.map((role) => ({
      id: role.id,
      roleName: role.name,
      status: 'Active',
      lastUpdate: formatDate(moment()),
      // imageUrl: 'Edit',
    })),
  );
  const [columns, setColumns] = useState([
    {
      field: 'id',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 120,
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'id',
      hideable: false,
    },
    {
      field: 'roleName',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 150,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'RoleName',
    },
    {
      field: 'status',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 150,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Status',
    },
    {
      field: 'lastUpdate',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 150,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Last Update Time',
    },
    {
      field: 'imageUrl',
      width: 150,
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 150,
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Action',
      renderCell: (params) => <DspRolesCustomCell value={params} canUpdate={pageRoles.canUpdate} />,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleLicence = () => {
    setShowLicence((prev) => !prev);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="job-application-form">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="bg_Div mt-2 d-flex flex-column">
                <DataGridHeader
                  title="4DSPS Roles"
                  otherControls={[{ icon: cilChevronBottom, fn: toggleLicence }]}
                />

                {showLicence === true ? (
                  <div className="show-stock">
                    <div className="row pt-2">
                      <div className="col-md-12 col-xl-12">
                        <CustomDatagrid
                          rows={rows}
                          columns={columns}
                          pagination={false}
                          rowHeight={50}
                          hiddenCols={{
                            columnVisibilityModel: {
                              id: false,
                            },
                          }}
                          canExport={pageRoles.canExport}
                          canPrint={pageRoles.canPrint}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default DSPSRoles;
