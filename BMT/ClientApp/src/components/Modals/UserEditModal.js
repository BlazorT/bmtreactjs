import React from 'react';

import CIcon from '@coreui/icons-react';
import { cilCalendar, cilUser } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const UserEditModal = (prop) => {
  const { isOpen, toggle } = prop;
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>
        <h5 className="labelName">Add New Partner</h5>
      </ModalHeader>
      <ModalBody className="paddingAllSide">
        <div className="">
          <div className=" text-center">
            <div className="row">
              <div className="col-md-6">
                <div className="form-outline text-start">
                  <label htmlFor="" className="login_label labelName">
                    Name
                  </label>
                  <div className="input-group position-relative">
                    <span className="input-group-addon" title=" Name">
                      <CIcon className="mandatory-control" icon={cilUser}></CIcon>
                    </span>
                    <input
                      type="text"
                      className="form-control item "
                      id="FirstName"
                      name="FirstName"
                      placeholder=" Name"
                      //   value={firstName}
                      //   onChange={(e) => this.handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-outline text-start">
                  <label htmlFor="" className="login_label labelName">
                    Last Name
                  </label>
                  <div className="input-group position-relative">
                    <span className="input-group-addon" title=" Name">
                      <CIcon className="stock-toggle-icon" icon={cilUser}></CIcon>
                    </span>
                    <input
                      type="text"
                      className="form-control item "
                      id="FirstName"
                      name="FirstName"
                      placeholder="Last Name"
                      //   value={firstName}
                      //   onChange={(e) => this.handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-outline text-start">
                  <label htmlFor="" className="login_label labelName">
                    Sole
                  </label>
                  <div className="input-group position-relative">
                    <span className="input-group-addon" title=" Name">
                      <CIcon className="stock-toggle-icon" icon={cilUser}></CIcon>
                    </span>
                    <input
                      type="text"
                      className="form-control item "
                      id="FirstName"
                      name="FirstName"
                      placeholder="Sole"
                      //   value={firstName}
                      //   onChange={(e) => this.handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-outline text-start">
                  <label htmlFor="" className="login_label labelName">
                    Date Of Birth
                  </label>
                  <div className="input-group position-relative">
                    <span className="input-group-addon" title="SSN No">
                      <CIcon className="stock-toggle-icon" icon={cilCalendar}></CIcon>
                    </span>
                    <input
                      className="form-control item "
                      id="DOB"
                      name="DOB"
                      placeholder="Date Of Birth"
                      type="date"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-outline text-start">
                  <label htmlFor="" className="login_label labelName">
                    Contact
                  </label>
                  <div className="input-group position-relative">
                    <span className="input-group-addon" title=" Name">
                      <CIcon className="stock-toggle-icon" icon={cilUser}></CIcon>
                    </span>
                    <input
                      type="text"
                      className="form-control item "
                      id="FirstName"
                      name="FirstName"
                      placeholder="Contact"
                      //   value={firstName}
                      //   onChange={(e) => this.handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <CFormCheck
                  className=" mt-5"
                  id="flexCheckChecked"
                  label="Decision Making Authority"
                  defaultChecked
                />
              </div>
            </div>
          </div>
          <div className="CenterAlign pt-2">
            <button
              onClick={() => toggle()}
              type="button"
              className="btn btn_Default m-2 sales-btn-style"
            >
              Cancel
            </button>
            <button
              onClick={() => toggle()}
              type="button"
              className="btn btn_Default sales-btn-style m-2"
            >
              Submit
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default UserEditModal;
