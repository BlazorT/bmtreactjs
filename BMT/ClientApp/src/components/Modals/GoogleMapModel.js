import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { useDispatch, useSelector } from 'react-redux';

//import { GoogleMap, LoadScript } from '@react-google-maps/api';
const GoogleMapModel = (prop) => {
  const dispatch = useDispatch();
  const { isOpen, toggle } = prop;
  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: -34.397,
    lng: 150.644
  };
  const onCancel = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: () => onYesConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onYesConfirm = () => {
    toggle();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="Modal_Term_Condition">
      <ModalHeader>Area</ModalHeader>
      <ModalBody className="paddingAllSide">
        <div className="login-form" id="printTermsOfUse">
          {/*<LoadScript*/}
          {/*  googleMapsApiKey="YOUR_API_KEY"*/}
          {/*>*/}
          {/*  <GoogleMap*/}
          {/*    mapContainerStyle={mapStyles}*/}
          {/*    zoom={8}*/}
          {/*    center={defaultCenter}*/}
          {/*  >*/}
          {/*  </GoogleMap>*/}
          {/*</LoadScript>*/}
          

        </div>
        <div className="CenterAlign">
          <button
            type="button"
            onClick={() => onCancel()}
            className="btn_Default m-2 sales-btn-style"
          >
            Close
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default GoogleMapModel;
