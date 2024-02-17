/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { getFormattedDate } from 'src/helpers/getWeekDate';
import RosterWeeksCell from 'src/components/DataGridCustomCells/RosterWeeksCell';
import RosterGridHeader from 'src/components/DataGridCustomCells/RosterGridHeader';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';
import ColapseRosterCell from 'src/components/DataGridCustomCells/ColapseRosterCell';
import RosterVehicleCell from 'src/components/DataGridCustomCells/RosterVehicleCell';
import Tooltip from '@mui/material/Tooltip';

export const getDailyRosterCols = (
  setRows,
  pageRoles,
  daList,
  rows,
  startDate,
  endDate,
  vehicleList,
  getRoster,
  setSubmitData,
) => [
  {
    field: 'search',
    headerClassName: 'custom-header-data-grid',
    width: 180,
    // flex: 1,
    sortable: false,
    filterable: false,
    editable: false,
    renderHeader: (params) => (
      <GridToolbarQuickFilter
        className="p-1 rounded"
        quickFilterParser={(searchInput) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
      />
    ),
    renderCell: (params) =>
      (params.row.sunday !== '' && params.row.search === '') ||
      params.row.search === 'Work Block Restoreds' ||
      params.row.search === 'Scheduled associates' ? (
        <ColapseRosterCell params={params} setRows={setRows} />
      ) : (
        <Tooltip title={params.row.search.toUpperCase()}>
          <div className="text-truncate ms-2  text-uppercase ">{params.row.search}</div>
        </Tooltip>
        // <RosterVehicleCell params={params} />
      ),
    // params.row.sunday !== '' ? <RosterCheckCell params={params} /> :
  },

  {
    field: 'sunday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    // maxWidth:180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={0} />,
    cellClassName: () => !rows[0]?.sunToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={0}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
  {
    field: 'monday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={1} />,
    cellClassName: () => !rows[0]?.monToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={1}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
  {
    field: 'tuesday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={2} />,
    cellClassName: () => !rows[0]?.tueToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={2}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
  {
    field: 'wednesday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={3} />,
    cellClassName: () => !rows[0]?.wedToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={3}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
  {
    field: 'thursday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={4} />,
    cellClassName: () => !rows[0]?.thuToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={4}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
  {
    field: 'friday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={5} />,
    cellClassName: () => !rows[0]?.friToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={5}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
  {
    field: 'saturday',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    editable: false,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => <RosterGridHeader startDate={startDate} endDate={endDate} day={6} />,
    cellClassName: () => !rows[0]?.satToggle && 'bg-dull',
    renderCell: (params) => (
      <RosterWeeksCell
        params={params}
        setRows={setRows}
        rows={rows}
        startDate={startDate}
        endDate={endDate}
        day={6}
        daList={daList}
        vehicleList={vehicleList}
        getRoster={getRoster}
        setSubmitData={setSubmitData}
      />
    ),
  },
];
