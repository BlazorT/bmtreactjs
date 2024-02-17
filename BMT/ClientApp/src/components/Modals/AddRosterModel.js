/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import LoadingBtn from '../UI/LoadingBtn';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { cilAlignLeft, cilInfo } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';

import moment from 'moment';
import globalutil from 'src/util/globalutil';
import CustomInput from '../InputsComponent/CustomInput';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import { formValidator } from 'src/helpers/formValidator';
import useFetch from 'src/hooks/useFetch';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

import DateRangeSelector from '../Component/DateRangeSelector';
import Button from '../InputsComponent/Button';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';
import { getWeekRange } from 'src/helpers/getWeekDate';

const AddRosterModel = ({
  header,
  toggle,
  isOpen,
  vehicleList,
  user,
  getRoster,
  daList,
  rosters,
  fleetPlans,
  rosterRows,
}) => {
  useEffect(() => {
    if (isOpen && rosterRows?.length !== 3) {
      console.log({ rosterRows });
      setRosterData({
        id: rosterRows[3].rosterId,
        remarks: rosterRows[3].rosterRemarks,
        status: rosterRows[3].status,
      });
      setStartDate(new Date(rosterRows[3].rosterDate));
      setEndDate(new Date(rosterRows[3].rosterEndDate));
    } else if (isOpen) {
      console.log('coming');
    }
  }, [isOpen]);

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const sundayThisWeek = new Date(
    today.getTime() - (dayOfWeek === 0 ? 0 : dayOfWeek) * 24 * 60 * 60 * 1000,
  );
  const saturdayNextWeek = new Date(sundayThisWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState(
    rosterRows?.length !== 3 ? new Date(rosterRows[3]?.rosterDate) : sundayThisWeek,
  );
  const [endDate, setEndDate] = useState(
    rosterRows?.length !== 3 ? new Date(rosterRows[3]?.rosterEndDate) : saturdayNextWeek,
  );
  const { fetchData: createRoster } = useFetch();
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();

  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rosterData, setRosterData] = useState({
    remarks: '',
    vehicle: '',
    status: 22,
    id: 0,
    // rosterEndDate: moment().add(1, 'week').utc().format(),
  });

  useEffect(() => {
    if (isOpen) {
      const unAvailDa = getUnAvailableDa();

      const mapVehicle = daList
        .filter((item) => item.status !== 4)
        .filter((item) => !unAvailDa.includes(item.id))
        .map((item, index) => ({
          ...item,
          index: index,
          assign: false,
        }));

      setRows(mapVehicle);
      setIsLoading(false);
    }
  }, [isOpen, startDate, endDate]);

  const getUnAvailableDa = () => {
    const isWithinWeek = (start, end, weekStart, weekEnd) => {
      return start <= weekEnd && end >= weekStart;
    };
    const mappArray = fleetPlans.map((item, index) => {
      const roster = rosters.find((roster) => roster.id === item.rosterId);

      const rosterStartDate = roster?.rosterDate; // Replace 'startDate' with the actual property name from your data
      const rosterEndDate = roster?.rosterEndDate; // Replace 'endDate' with the actual property name from your data

      const withinWeek = isWithinWeek(
        rosterStartDate,
        rosterEndDate,
        moment(startDate).utc().format(),
        moment(endDate).utc().format(),
      );

      if (withinWeek) {
        return {
          id: item.rosteredDaid,
        };
      }
    });

    const unAvaialableDas = [
      ...new Set(mappArray.filter((item) => item !== undefined).map((item) => item.id)),
    ];

    return unAvaialableDas;
  };

  const handleRosterData = (e, label) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setRosterData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const onCancel = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: onYesConfirm,
      onNo: onNoConfirm,
    });
  };

  const onYesConfirm = () => {
    toggle();
    setRosterData({
      id: 0,
      remarks: '',
      status: 22,
    });
    setStartDate(sundayThisWeek);
    setEndDate(saturdayNextWeek);
    onNoConfirm();
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  function getMergedMomentFromWeekRange(weekStartDateString, weekEndDateString, targetDay) {
    const startDate = new Date(weekStartDateString);
    const endDate = new Date(weekEndDateString);
    const targetDayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
      targetDay.substr(0, 3),
    );

    let currentDate = new Date(startDate);

    // Move to the next occurrence of the target day
    while (currentDate.getDay() !== targetDayIndex) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure the date is within the provided date range
    if (currentDate >= startDate && currentDate <= endDate) {
      console.log({ weekStartDateString, weekEndDateString, targetDay }, currentDate.toISOString());
      return currentDate.toISOString();
    }

    return undefined;
  }

  function getNumberOfDaysInWeekRange(startDate, endDate) {
    // Parse the start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set hours, minutes, seconds, and milliseconds to 0 to compare dates without time
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the number of milliseconds in a day
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Initialize a counter for valid days
    let validDaysCount = 0;

    // Iterate through each day in the range
    for (let current = today; current <= end; current.setTime(current.getTime() + oneDayMs)) {
      // Check if the current day is valid (you can add more conditions if needed)
      if (current >= start && current <= end) {
        validDaysCount++;
      }
    }

    return validDaysCount;
  }
  const weeks = getWeekRange(startDate, endDate);
  const addRoster = async () => {
    const form = document.querySelector('.roster-form');
    formValidator();
    if (form.checkValidity()) {
      // const checkDa =
      //   new Set(rows.filter((row) => row.assign).map((row) => row.rosteredDaid)).size !==
      //   rows.filter((row) => row.assign).length;
      if (rows.filter((item) => item.assign === true).length < 1) {
        showToast('Assign Associates', 'warning');
        return;
      }

      const validDays = getNumberOfDaysInWeekRange(startDate, endDate);
      console.log({ startDate, endDate, validDays }, weeks);
      setIsLoading(true);
      const fleetplans = rows
        .filter((item) => item.assign === true)
        .flatMap((item) =>
          Array.from({ length: validDays }).map((_, index) => ({
            id: 0,
            vehicleId: 0,
            helperDriverId: 0,
            wincode: '',
            rosteredDaid: item.id,
            status: 1,
            lastUpdatedBy: user.userId,
            createdBy: user.userId,
            createdAt: moment().utc().format(),
            lastUpdatedAt: moment().utc().format(),
            scheduleDate:
              weeks[index + (7 - validDays)] && index !== weeks.length - 1
                ? getMergedMomentFromWeekRange(startDate, endDate, weeks[index + (7 - validDays)])
                : moment(endDate).format(),
            rowVer: 1,
          })),
        );
      // console.log({ endDate, startDate });
      const rosterBody = {
        id: rosterData.id,
        rosterTypeId: 1,
        dspId: user.dspId,
        rosterEndDate: moment(endDate).format(),
        rosterDate: moment(startDate)
          .add(7 - validDays, 'day')
          .format(),
        rosterPlanDate: moment().utc().format(),
        status: rosterData.status,
        rosterRemarks: rosterData.remarks,
        week: moment()
          .diff(moment(moment(moment()).startOf('month')).startOf('week'), 'weeks')
          .toString(),
        lastUpdatedBy: user.userId,
        createdBy: user.userId,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
        rowVer: 1,
        fleetplans,
      };
      // console.log('Roster Body', JSON.stringify(rosterBody));
      console.log({ rosterBody });

      await createRoster(
        '/RosterPlan/submitroster',
        { method: 'POST', body: JSON.stringify(rosterBody) },
        (res) => {
          console.log({ res });
          if (res.status) {
            getRoster();
            toggle();
            showToast(res.message);
            setRosterData({
              remarks: '',
              vehicle: '',
              status: '',
              rosterStartDate: moment().utc().format(),
              rosterEndDate: moment().add(1, 'week').utc().format(),
            });
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    }
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const rosterVehicleCols = [
    {
      field: 'assign',
      headerClassName: 'custom-header-data-grid',
      width: 80,
      headerName: 'Assign',
      filterable: false,
      renderCell: (params) =>
        params.row.sunday !== '' && (
          <div className="w-100 h-100 d-flex justify-content-start align-items-center">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                className={'mt-0'}
                name={params.id}
                onChange={(e) => {
                  setRows((prev) => {
                    return prev.map((row) => {
                      if (row.id === params.id) {
                        return {
                          ...row,
                          assign: e.target.checked,
                        };
                      }
                      return row;
                    });
                  });
                }}
                checked={params.row.assign}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        ),
    },
    // {
    //   field: 'rosteredDaid',
    //   headerClassName: 'custom-header-data-grid',
    //   minWidth: 180,
    //   flex: 1,
    //   headerName: 'Associates',
    //   filterable: false,
    //   renderCell: (params) => (
    //     <RosterModelDaCell daList={daList} rows={rows} setRows={setRows} params={params} />
    //   ),
    // },
    {
      field: 'name',
      headerClassName: 'custom-header-data-grid',
      minWidth: 180,
      flex: 1,
      headerName: 'Associate',
      filterable: false,
      renderHeader: () => (
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
      renderCell: (params) => params.row.firstName,
    },
    {
      field: 'state',
      headerClassName: 'custom-header-data-grid',
      minWidth: 180,
      flex: 1,
      headerName: 'State',
      filterable: false,
      renderCell: (params) => params.row.stateName,
    },
    {
      field: 'code',
      headerClassName: 'custom-header-data-grid',
      minWidth: 180,
      flex: 1,
      headerName: 'Code',
      filterable: false,
      renderCell: (params) => params.row.userId,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={true}
      fullscreen="lg"
      className="w-50"
      centered={true}
      toggle={toggle}
    >
      <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>
      <form className="roster-form needs-validation" onSubmit={handleSubmit} noValidate>
        <ModalBody className="confirmation-modal-body">
          <CRow>
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              prevDisable={true}
              disable={rosterRows?.length != 3 ? true : false}
            />
            {getUnAvailableDa().length === 0 || rosterRows?.length > 3 ? (
              <React.Fragment>
                <CCol sm={6}>
                  <CustomSelectInput
                    label="Status"
                    value={rosterData.status}
                    onChange={handleRosterData}
                    icon={cilInfo}
                    id="status"
                    name="status"
                    options={globalutil.synchstatuses()}
                    isRequired={true}
                    disableOption="Select Status"
                    message="select status"
                  />
                </CCol>
                <CCol sm={6}>
                  <CustomInput
                    label="Remarks"
                    value={rosterData.remarks}
                    icon={cilAlignLeft}
                    onChange={handleRosterData}
                    type="text"
                    id="remarks"
                    name="remarks"
                    placeholder="Enter Remarks"
                    isRequired={false}
                    message="enter remarks"
                  />
                </CCol>
                <CCol sm={12}>
                  <CustomDatagrid
                    rows={rows}
                    columns={rosterVehicleCols}
                    rowHeight={45}
                    pagination={true}
                    loading={isLoading}
                    pageNumber={6}
                  />
                </CCol>
              </React.Fragment>
            ) : (
              <div className="mt-5">Roster already available of this week</div>
            )}
          </CRow>
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          {isLoading ? (
            <LoadingBtn title="Submitting" />
          ) : (
            <React.Fragment>
              <Button title="Cancel" onClick={onCancel} />
              {getUnAvailableDa().length === 0 && (
                <Button title="Save" type="submit" onClick={addRoster} />
              )}
              {rosterRows?.length > 3 && (
                <Button title="Update" type="submit" onClick={addRoster} />
              )}
            </React.Fragment>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
};
export default AddRosterModel;
