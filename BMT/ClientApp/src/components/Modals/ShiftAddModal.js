import React, { useState } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { cilTask, cilCalendar, cilCode, cilExcerpt, cilGraph, cilInfo } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';

import CustomTimePicker from 'src/components/UI/TimePicker';
import dayjs from 'dayjs';
import moment from 'moment';
import { formValidator } from 'src/helpers/formValidator';

const ShiftAddModal = (prop) => {

  const { header, isOpen, toggle, shiftData, getShifts } = prop;
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const {
    response: createShiftRes,
    loading: createShiftLoading,
    error: createServiceError,
    fetchData: createShift,
  } = useFetch();

  const initialData = {
    id: shiftData ? shiftData.id : 0,
    dspId: user.dspId,
    shiftTypeId: shiftData ? shiftData.shiftTypeId : 0,
    name: shiftData ? shiftData.name : '',
    description: shiftData ? shiftData.description : '',
    status: shiftData ? shiftData.status : '',
    assignmentType: shiftData ? shiftData.assignmentType :0,
    rowVer: shiftData ? shiftData.rowVer : 0,
    hours: shiftData ? shiftData.hours : 0,
    startTime: dayjs(),
    endTime: dayjs().add(1, 'hour'),
    expiryTime: dayjs(),
    createdBy: user.userId,
    lastUpdatedBy: user.userId,
    createdAt: moment().utc().format(),
    lastUpdatedAt: moment().utc().format(),
  };


  const [shiftAddData, setShiftAddData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleServiceIntegration = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setShiftAddData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const onSave = async () => {
    const form = document.querySelector('.shift-add-form');
    formValidator();
    if (form.checkValidity()) {
      const shift = {
        id: shiftAddData.id,
        dspId: user.dspId,
        name: shiftAddData.name,
        description: shiftAddData.description,
        assignmentType: shiftAddData.assignmentType,
        shiftTypeId: shiftAddData.shiftTypeId,
        status: shiftAddData.status === '' ? 1 : shiftAddData.status,
        rowVer: shiftAddData.rowVer,
        hours: shiftAddData.hours,
        startTime: dayjs(),
        expiryTime: shiftAddData.endTime,
        endTime: dayjs().add(1, 'hour'),
        createdBy: user.userId,
        lastUpdatedBy: user.userId,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
      };

      setIsLoading(createShiftLoading.current);
      await createShift('/Common/submitshift', {
        method: 'POST',
        body: JSON.stringify(shift),
      });
      console.log({ createShiftRes });
      if (createShiftRes.current?.status === true) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createShiftRes.current.message,
            toastVariant: 'success',
          }),
        );
        navigate('/waves');
        //getShifts();
        setShiftAddData(initialData);
        toggle();
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createShiftRes.current?.message,
            toastVariant: 'error',
            //  `${JSON.stringify(createUserRes.current.message)}`,
          }),
        );

        setIsLoading(createShiftLoading.current);
      }
    }
  };
  //const [shifts, setShifts] = useState({
  //  name: '',
  //  startTime: dayjs(),
  //  hours: 1,
  //  endTime: dayjs().add(1, 'hour'),
  //});

  const handleShiftChange = (e, label) => {
    if (label === 'startTime' || label === 'endTime') {
      console.log(e.$d);
      setShiftAddData((prev) => ({
        ...prev,
        [label]: e,
      }));
    } else {
      const { name, value } = e.target;
      console.log({ name, value });
      setShiftAddData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (label === 'startTime') {
      calculateTimes(e, shiftAddData.endTime, '');
    } else if (label === 'endTime') {
      calculateTimes(shiftAddData.startTime, e, '');
    } else if (label === 'hours') {
      calculateTimes(shiftAddData.startTime, '', e.target.value);
    } else {
     // calculateTimes(shiftAddData.startTime,e, shiftAddData.endTime, '');
    }
  };

  //const addShift = () => {
  //  formValidator();
  //};

 

  const calculateTimes = (startTime, endTime, hours) => {
    if (startTime && endTime) {
      console.log({ startTime, endTime, hours });
      // Calculate duration based on start and end times
      const calculatedDuration = endTime.diff(startTime, 'hour');

      setShiftAddData((prev) => ({
        ...prev,
        hours: calculatedDuration,
      }));
    } else if (startTime && hours) {
      console.log({ startTime, endTime, hours });
      // Calculate end time based on start time and duration
      const endDateTime = startTime.add(hours, 'hour');
      setShiftAddData((prev) => ({
        ...prev,
        endTime: endDateTime,
      }));
    } else if (endTime && hours) {
      console.log({ startTime, endTime, hours });
      // Calculate start time based on end time and duration
      const startDateTime = endTime.subtract(hours, 'hour');
      setShiftAddData((prev) => ({
        ...prev,
        startTime: startDateTime,
      }));
    }
  };
  const [selectedOption, setSelectedOption] = useState('');
  const options = [
  //  { value: 'Select Shift Type',label: 'Select Shift Type' },
    { value: 1, name: 'General Wave' },
    { value: 2, name: 'Regular Wave' },
  ];

  // Event handler for option selection
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="paddingAllSide">
        <form className="needs-validation shift-add-form" onSubmit={handleSubmit} noValidate>
          <div className="">
            <div className="text-center">
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Wave Name"
                    value={shiftAddData.name}
                    onChange={handleShiftChange}
                    icon={cilTask}
                    type="text"
                    className="form-control item"
                    id="name"
                    name="name"
                    placeholder="wave name"
                    isRequired={true}
                    message="Enter wave Name"
                    title="Wave Name"
                  />
                </div>
                <div className="col-md-6">
                  <CustomInput
                    label="Wave Hours"
                    icon={cilTask}
                    type="number"
                    className="form-control item "
                    id="hours"
                    name="hours"
                    placeholder="wave hours"
                    isRequired={true}
                    message="Enter Wave Hours"
                    title="Wave Hours"
                    value={shiftAddData.hours}
                    onChange={(e) => handleShiftChange(e, 'hours')}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-2">
                  <CustomTimePicker
                    icon={cilCalendar}
                    label="Wave Start Time"
                    id="startTime"
                    name="startTime"
                    // onClick={calculateEndTime}
                    title="Wave Start Time"
                    value={shiftAddData.startTime}
                    onChange={(e) => handleShiftChange(e, 'startTime')}
                    maxTime={shiftAddData.endTime}
                  />
                </div>
                <div className="col-md-6 mt-2">
                  <CustomTimePicker
                    icon={cilCalendar}
                    label="Wave End Time"
                    id="endTime"
                    name="endTime"
                    value={shiftAddData.endTime}
                    title="Wave End Time"
                    onChange={(e) => handleShiftChange(e, 'endTime')}
                    minTime={shiftAddData.startTime}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomSelectInput
                    label="Wave Type"
                    value={shiftAddData.shiftTypeId}
                    onChange={handleShiftChange}
                    icon={cilGraph}
                    id="shiftTypeId"
                    disableOption="Select Wave Type"
                    name="shiftTypeId"
                    options={options}
                    title="Wave Type"
                   // selectedOption={options}
                    isRequired={false}
                   // alue={selectedOption}
                   // onChange={handleOptionChange}
                  />
                </div>
                <div className="col-md-6">
                  <CustomSelectInput
                    label="Status"
                    icon={cilInfo}
                    id="status"
                    name="status"
                    disableOption="Select Status"
                    options={globalutil.commonstatuses()}
                    value={shiftAddData.status}
                    onChange={handleShiftChange}
                    isRequired={false}
                    title="status"
                    message="Please select status"
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <div className="form-outline text-start">
                    <label htmlFor="" className="login_label labelName mb-2">
                      Description
                    </label>
                    <textarea
                      className="FullWidth"
                      rows="3"
                      name="description"
                      id="description"
                      onChange={handleShiftChange}
                      value={shiftAddData.description}
                      placeholder="wave description text"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="CenterAlign pt-2">
              <button
                onClick={toggle}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn_Default sales-btn-style m-2"
                //onClick={addShift}
                onClick={() => onSave()}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
export default ShiftAddModal;
