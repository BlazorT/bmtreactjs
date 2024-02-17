import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';

import useFetch from 'src/hooks/useFetch';
import utc from 'dayjs/plugin/utc';
import { getDailyRosterCols } from 'src/configs/ColumnsConfig/dailyRosterCols';
import AddRosterModel from 'src/components/Modals/AddRosterModel';
import { getVehicles } from 'src/api/vehicleApi';

import { useShowToast } from 'src/hooks/useShowToast';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import DateRangeSelector from 'src/components/Component/DateRangeSelector';
import AppContainer from 'src/components/UI/AppContainer';
import { getWeekRange } from 'src/helpers/getWeekDate';
import Loading from 'src/components/UI/Loading';
import Button from 'src/components/InputsComponent/Button';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import Popover from 'src/components/UI/Popover';
import { toggleSidebar } from 'src/redux/sidebar/sidebarSlice';
import useApi from 'src/hooks/useApi';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import rosterReport from '../Reports/RosterReport';

const DailyRoster = () => {
  dayjs.extend(utc);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(toggleSidebar(false));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([getRoster(), fetchUsersData(), fetchVehicleData()]);

      setIsLoading(false);
    } catch (error) {
      showToast(error, 'error');

      setIsLoading(false);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const publishPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Call the fetchData function

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const sundayThisWeek = new Date(
    today.getTime() - (dayOfWeek === 0 ? 0 : dayOfWeek) * 24 * 60 * 60 * 1000,
  );
  const saturdayNextWeek = new Date(sundayThisWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Dispatchment',
  );

  const user = useSelector((state) => state.user);

  const { fetchData: fetchRosterData } = useFetch();
  const { data, loading, error, postData } = useApi('/RosterPlan/submitroster');

  const { fetchData: fetchVehicle } = useFetch();
  const { fetchData: fetchRoster } = useFetch();
  const { data: daData, fetchUsers: getUserbyRole } = useFetchUsers();

  const showToast = useShowToast();

  const [daList, setDaList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [isRosterMdlOpen, setIsRosterMdlOpen] = useState(false);
  const [allRosters, setAllRosters] = useState([]);
  const [fleetPlans, setFleetPlans] = useState([]);
  const [submitData, setSubmitData] = useState([]);
  const [startDate, setStartDate] = useState(sundayThisWeek);
  const [endDate, setEndDate] = useState(saturdayNextWeek);
  const [publishWeeks, setPublishWeeks] = useState(1);

  const getRoster = async (filters) => {
    setIsLoading(true);
    const rosterBody = {
      dspId: user.dspId,
      id: 0,
      rosterTypeId: 0,
      rowVer: 0,
      status: 0,
      lastUpdatedAt: moment().utc().format(),
      createdAt: moment().subtract(2, 'month').utc().format(),
      ...filters,
    };

    await fetchRosterData(
      '/RosterPlan/rosterplans',
      {
        method: 'POST',
        body: JSON.stringify(rosterBody),
      },
      async (res) => {
        if (res.status) {
          setAllRosters(res.data);
          await fetchRosterById(res.data);
        } else {
          showToast(res.message, 'error');
        }
      },
    );
  };

  const fetchRosterById = async (data) => {
    const rosterBody = {
      dspId: user.dspId,
      id: 0,
      rosterTypeId: 1,
      rowVer: 0,
      status: 0,
      lastUpdatedAt: moment().utc().format(),
      createdAt: moment().subtract(1, 'month').utc().format(),
    };

    await fetchRoster(
      '/RosterPlan/rosterfleetplandetails',
      {
        method: 'POST',
        body: JSON.stringify(rosterBody),
      },
      (res) => {
        console.log({ res });
        console.log({ data });
        if (res.data.status) {
          setFleetPlans(res.data.data);
          formatDataToRows(res.data.data, data);
        } else {
          showToast(res.message, 'error');
        }
      },
    );
    // setGridLoading(false);
  };

  useEffect(() => {
    if (fleetPlans.length > 0) {
      formatDataToRows(fleetPlans, allRosters);
    } else {
      setRows(firstArray);
    }
  }, [startDate]);

  function isDayValidInWeekRange(dayToggle, startDate, endDate) {
    const currentDayIndex = new Date().getDay();
    const dayIndex = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(
      dayToggle.toLowerCase().substring(0, 3),
    );

    if (dayIndex === -1) {
      // Handle invalid dayToggle value
      return false;
    }

    const currentDate = new Date();
    const currentDateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const startDateWithoutTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    const endDateWithoutTime = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    );

    // Check if the day is in the future week
    const isDayInFutureWeek = startDateWithoutTime > currentDateWithoutTime;
    if (isDayInFutureWeek) return true;

    // If the day is in the current week or in the future week and within the specified date range, return true
    return (
      (dayIndex >= currentDayIndex || isDayInFutureWeek) &&
      currentDateWithoutTime >= startDateWithoutTime &&
      currentDateWithoutTime <= endDateWithoutTime
    );
  }
  const firstArray = [
    {
      id: 0,
      index: 0,
      search: '',
      vehicle: '',
      associate: '',
      sunday: 'toggle',
      monday: 'toggle',
      tuesday: 'toggle',
      wednesday: 'toggle',
      thursday: 'toggle',
      friday: 'toggle',
      saturday: 'toggle',
      sunToggle: isDayValidInWeekRange('sunToggle', startDate, endDate),
      monToggle: isDayValidInWeekRange('monToggle', startDate, endDate),
      tueToggle: isDayValidInWeekRange('tueToggle', startDate, endDate),
      wedToggle: isDayValidInWeekRange('wedToggle', startDate, endDate),
      thuToggle: isDayValidInWeekRange('thuToggle', startDate, endDate),
      friToggle: isDayValidInWeekRange('friToggle', startDate, endDate),
      satToggle: isDayValidInWeekRange('satToggle', startDate, endDate),
    },
    {
      id: 1,
      search: 'Work Block Restoreds',
      vehicle: '',
      associate: '',
      sunday: '37 of 37',
      monday: '37 of 37',
      tuesday: '40 of 40',
      wednesday: '37 of 37',
      thursday: '37 of 37',
      friday: '37 of 37',
      saturday: '37 of 37',
    },
    {
      id: 2,
      search: 'Scheduled associates',
      associate: '',
      vehicle: '',
      sunday: '15',
      monday: '35',
      tuesday: '17',
      wednesday: '25',
      thursday: '10',
      friday: '5',
      saturday: '22',
    },
  ];
  const formatDataToRows = (fleetData, data) => {
    // setRows([]);
    setGridLoading(true);
    const weeks = getWeekRange(startDate, endDate);

    const isWithinWeek = (start, end, weekStart, weekEnd) => {
      return start <= weekEnd && end >= weekStart;
    };

    const mappArray = [];

    const daCount = getUniqueRosteredDaidArray(fleetData);

    daCount.forEach((item, index) => {
      // Assuming 'rosterId' is the correct property name; replace it with the actual property name from your data
      const roster = data.find((roster) => roster.id === item.rosterId);

      if (roster) {
        const rosterStartDate = roster.rosterDate; // Replace 'startDate' with the actual property name from your data
        const rosterEndDate = roster.rosterEndDate; // Replace 'endDate' with the actual property name from your data

        const withinWeek = isWithinWeek(
          rosterStartDate,
          rosterEndDate,
          moment(startDate).utc().format(),
          moment(endDate).utc().format(),
        );

        const perDayPlan = fleetData
          .map((row) => item.rosteredDaid == row.rosteredDaid && row)
          .filter((item) => item !== undefined && item);

        console.log(
          perDayPlan.find((plan) => areDatesEqual(weeks[1], plan.scheduleDate) && plan),
          { perDayPlan },
          'yo',
        );
        const sunday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[0], plan.scheduleDate) && plan,
        );
        const monday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[1], plan.scheduleDate) && plan,
        );
        const tuesday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[2], plan.scheduleDate) && plan,
        );
        const wednesday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[3], plan.scheduleDate) && plan,
        );
        const thursday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[4], plan.scheduleDate) && plan,
        );
        const friday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[5], plan.scheduleDate) && plan,
        );
        const saturday = perDayPlan.find(
          (plan) => areDatesEqual(weeks[6], plan.scheduleDate) && plan,
        );

        if (withinWeek) {
          const resultItem = {
            // ...item,
            ...roster,
            id: index + 3,
            rosterId: item.rosterId,
            index: index + 3,
            search: item.daUserName,
            rosteredDaid: item.rosteredDaid,
            weeklyPlan: {
              sunday: sunday
                ? {
                    ...sunday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => sunday?.vehicleId !== 0 && v.id === sunday.vehicleId,
                      ) || '',
                  }
                : undefined,
              monday: monday
                ? {
                    ...monday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => monday?.vehicleId !== 0 && v.id === monday.vehicleId,
                      ) || '',
                  }
                : undefined,

              tuesday: tuesday
                ? {
                    ...tuesday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => tuesday?.vehicleId !== 0 && v.id === tuesday.vehicleId,
                      ) || '',
                  }
                : undefined,

              wednesday: wednesday
                ? {
                    ...wednesday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => wednesday?.vehicleId !== 0 && v.id === wednesday.vehicleId,
                      ) || '',
                  }
                : undefined,

              thursday: thursday
                ? {
                    ...thursday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => thursday?.vehicleId !== 0 && v.id === thursday.vehicleId,
                      ) || '',
                  }
                : undefined,

              friday: friday
                ? {
                    ...friday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => friday?.vehicleId !== 0 && v.id === friday.vehicleId,
                      ) || '',
                  }
                : undefined,

              saturday: saturday
                ? {
                    ...saturday,
                    vehicleMake:
                      vehicleList.find(
                        (v) => saturday?.vehicleId !== 0 && v.id === saturday.vehicleId,
                      ) || '',
                  }
                : undefined,
            },
            sunday: weeks[0],
            monday: weeks[1],
            tuesday: weeks[2],
            wednesday: weeks[3],
            thursday: weeks[4],
            friday: weeks[5],
            saturday: weeks[6],
          };

          mappArray.push(resultItem);
        }
      }
    });

    const filterArray = mappArray.filter((item) => item !== undefined);
    console.log({ mappArray });
    setRows([...firstArray, ...filterArray]);
    setIsLoading(false);
    setGridLoading(false);
  };
  function areDatesEqual(dateString1, dateString2) {
    // Parse dateString1
    const date1Components = dateString1.split(' ');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month1 = monthNames.indexOf(date1Components[1]);
    const day1 = parseInt(date1Components[2], 10);

    // Parse dateString2
    const date2 = new Date(dateString2);
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // console.log({ dateString1, dateString2 }, month1 === month2 && day1 === day2);
    // Compare the dates (ignoring the time component)
    return month1 === month2 && day1 === day2;
  }

  function getUniqueRosteredDaidArray(rows) {
    const uniquePairs = [];

    rows.forEach((item) => {
      // Assuming 'rosteredDaid' and 'rosterId' are the correct property names; replace them with the actual property names from your data
      const pair = {
        rosterId: item.rosterId,
        rosteredDaid: item.rosteredDaid,
        daUserName: item.daUserName,
      };
      const isPairUnique = !uniquePairs.some(
        (existingPair) =>
          existingPair.rosterId === pair.rosterId &&
          existingPair.rosteredDaid === pair.rosteredDaid,
      );

      if (isPairUnique) {
        uniquePairs.push(pair);
      }
    });

    return uniquePairs;
  }

  const fetchUsersData = async () => {
    const das = await getUserbyRole(3);
    setDaList(das);
  };

  const fetchVehicleData = async () => {
    const vehicle = await getVehicles(user, fetchVehicle);
    if (vehicle.status) {
      setVehicleList(vehicle.data);
    } else {
      showToast(vehicle.message, 'error');
    }
  };

  const toggleRosterMdl = () => {
    setIsRosterMdlOpen(!isRosterMdlOpen);
  };

  const PublishPopOverContent = () => (
    <div className="popover-roster">
      <div className="d-flex justify-content-between align-items-center border-bottom-1px pb-2">
        <span>Publish to A to Z</span>
      </div>
      <div className="">
        <p className="text-dim m-0 p-0 mt-2 mb-2 ">Publish all shifts for</p>
        <CustomSelectInput
          id="publishShifts"
          name="publishShifts"
          width="w-100 mt-2 mb-2"
          options={[
            { id: 1, name: 'Next 1 Weeks' },
            { id: 2, name: 'Next 2 Weeks' },
            { id: 3, name: 'Next 3 Weeks' },
            { id: 4, name: 'Next 4 Weeks' },
            { id: 5, name: 'Next 5 Weeks' },
            { id: 6, name: 'Next 6 Weeks' },
            { id: 7, name: 'Next 7 Weeks' },
            { id: 8, name: 'Next 8 Weeks' },
            { id: 9, name: 'Next 9 Weeks' },
            { id: 10, name: 'Next 10 Weeks' },
          ]}
          value={publishWeeks}
          onChange={(e) => setPublishWeeks(e.target.value)}
        />
        <Button
          title={`Publish ${publishWeeks} shifts`}
          className="w-100 mt-2 mb-2"
          onClick={handleClose}
        />
      </div>
    </div>
  );
  const onSave = async () => {
    const rosterPlanBody = {
      id: rows[3].rosterId,
      rosterTypeId: 1,
      dspId: rows[3].dspId,
      rosterEndDate: rows[3].rosterEndDate,
      rosterDate: rows[3].rosterDate,
      rosterPlanDate: rows[3].rosterPlanDate,
      status: rows[3].status,
      rosterRemarks: rows[3].rosterRemarks,
      week: rows[3].week,
      lastUpdatedBy: user.userId,
      createdBy: rows[3].createdBy,
      createdAt: rows[3].createdAt,
      lastUpdatedAt: moment().utc().format(),
      rowVer: 1,
      fleetPlans: rows
        .flatMap((row) => {
          const weeklyPlan = row.weeklyPlan;
          if (weeklyPlan && typeof weeklyPlan === 'object') {
            // Filter out objects where key is "vehicleMake"
            const filteredValues = Object.values(weeklyPlan).filter((item) => item);
            return filteredValues;
          } else {
            return [];
          }
        })
        .filter((item) => item !== undefined && item !== null),
    };

    console.log({ submitData, rows, rosterPlanBody });
    if (submitData.length <= 0) {
      showToast(
        'No assignments assigned. Please assign at least one item before saving.',
        'warning',
      );
      return;
    }
    const res = await postData(rosterPlanBody);
    if (res.status === true) {
      setSubmitData([]);
      getRoster();
    } else {
      showToast(res.message, 'error');
    }
    console.log(res, 'assign vehicle res');
  };

  const dailyRoasterCols = getDailyRosterCols(
    setRows,
    pageRoles,
    daList,
    rows,
    startDate,
    endDate,
    vehicleList,
    getRoster,
    setSubmitData,
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppContainer>
      <DataGridHeader
        title="Schedule"
        addSecButton={
          pageRoles.canAdd === 1 ? (
            rows.length === 3 ? (
              'Schedule (+)'
            ) : (
              <span className="d-flex gap-2 justify-content-center align-items-center ">
                Edit
                <CIcon icon={cilPencil} size="sm" />
              </span>
            )
          ) : (
            ''
          )
        }
        addSecBtnClick={toggleRosterMdl}
        addBtnClick={publishPopOver}
        addButton="Publish"
        addBtnContent={`until 0${publishWeeks}/10 (${publishWeeks})`}
        popOverId={id}
        actions={[
          rows.length != 3 && {
            title: 'Save (+)',
            onClick: onSave,
          },
        ]}
      />
      {/* <button onClick={() => console.log({ rows })}>save</button> */}
      <Popover
        id={id}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        content={<PublishPopOverContent />}
      />

      <div className="mt-2">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
        />
        <CustomDatagrid
          rows={rows}
          columns={dailyRoasterCols}
          rowHeight={65}
          pagination={true}
          loading={gridLoading || loading || isLoading}
          canExport={pageRoles.canExport}
          canPrint={pageRoles.canPrint}
          noRowsMessage={'No schedule'}
          justifyContent={'left'}
          cellBorder={true}
          rowSelection={true}
          isZeroMargin={true}
        />
        <AddRosterModel
          header={rows.length === 3 ? 'Create Schedule' : 'Edit Schedule'}
          isOpen={isRosterMdlOpen}
          toggle={toggleRosterMdl}
          rosterRows={rows}
          daList={daList}
          vehicleList={vehicleList}
          user={user}
          getRoster={fetchData}
          rosters={allRosters}
          fleetPlans={fleetPlans}
        />
      </div>
    </AppContainer>
  );
};

export default DailyRoster;
