// React and third-party libraries
import React, { useState } from 'react';

import { faCircle, faCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../CSS/Signup.css';

const Register = () => {
  const [selectedImage, setSelectedImage] = useState('Profile-pic.jpg');
  const [password, setPassword] = useState('');
  const [isDivVisible, setIsDivVisible] = useState(false);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleDropZoneClick = () => {
    const fileInput = document.getElementById(`fileInput`);

    fileInput.click();
  };
  const handleIconClick = () => {
    setIsDivVisible(!isDivVisible);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  const calculatePasswordStrength = () => {
    let strength = 0;

    // Check for lowercase and uppercase letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength += 1;
    }

    // Check for a number
    if (/\d/.test(password)) {
      strength += 1;
    }

    // Check for a special character
    if (/[!@#$%^&*]/.test(password)) {
      strength += 1;
    }

    // Check for at least 8 characters
    if (password.length >= 8) {
      strength += 1;
    }

    return strength;
  };
  const setIcon = () => {
    const criteria = {
      lowercaseUppercase: false,
      number: false,
      specialCharacter: false,
      eightCharacter: false,
    };

    // Check for lowercase and uppercase letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      criteria.lowercaseUppercase = true;
    }

    // Check for a number
    if (/\d/.test(password)) {
      criteria.number = true;
    }

    // Check for a special character
    if (/[!@#$%^&*]/.test(password)) {
      criteria.specialCharacter = true;
    }

    // Check for at least 8 characters
    if (password.length >= 8) {
      criteria.eightCharacter = true;
    }

    return criteria;
  };
  const calculateProgressBarWidth = () => {
    const strength = calculatePasswordStrength();
    setIcon();
    return (strength / 4) * 100; // Assuming 4 as the maximum strength level
  };
  const getProgressBarClassName = () => {
    const strength = calculatePasswordStrength();

    if (strength === 0) {
      return 'progress-bar';
    } else if (strength === 1) {
      return 'progress-bar bg-danger';
    } else if (strength === 2) {
      return 'progress-bar bg-warning';
    } else if (strength === 3) {
      return 'progress-bar bg-info';
    } else if (strength === 4) {
      return 'progress-bar bg-success';
    }
  };

  return (
    <>
      <section>
        <div className="mask d-flex align-items-center">
          <div className="container py-4">
            <div className="row d-flex justify-content-center align-items-center ">
              <div className="col-12 col-md-12 col-lg-12 col-xl-10">
                <div className="card">
                  <div className="card-body p-4">
                    <h2 className="text-uppercase text-center creat-account mb-3">
                      Create an account
                    </h2>

                    <form>
                      <div className="profile-pic-wrapper">
                        <div className="pic-holder">
                          {selectedImage && (
                            <img id="profilePic" className="pic" src={selectedImage} />
                          )}
                          <input
                            className="uploadProfileInput"
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <label
                            className="upload-file-block"
                            onClick={() => handleDropZoneClick()}
                          >
                            <div className="text-center">
                              <div className="mb-2">
                                <i className="fa fa-camera fa-2x"></i>
                              </div>
                              <div className="text-uppercase">
                                Upload <br /> Profile Photo
                              </div>
                            </div>
                          </label>
                        </div>
                        <p className="text-info text-center small pt-2">Select Profile Photo</p>
                      </div>
                      <div className="row align-items-center">
                        <div className="form-outline  col-md-4 mb-4">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            id="form3Example1cg"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline col-md-4 mb-4">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            id="form3Example1cg"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline col-md-4 mb-2">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            id="form3Example4cg"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline col-md-4 mb-2">
                          <label className="form-label">Contact No</label>
                          <input
                            type="number"
                            id="form3Example4cg"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline  col-md-4 mb-2 ">
                          <label className="form-label">Gender</label>
                          <div>
                            <div className="form-check form-check-inline check-width">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio1"
                                value="option1"
                              />
                              <label className="form-check-label">Male</label>
                            </div>

                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio2"
                                value="option2"
                              />
                              <label className="form-check-label">Female</label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="md-form md-outline input-with-post-icon datepicker">
                            <label htmlFor="example" className="form-label">
                              Date of birth
                            </label>
                            <input
                              placeholder="Select date"
                              type="date"
                              id="example"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline mb-2">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          id="form3Example4cg"
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="row">
                        <div className="form-outline col-md-6 mb-4">
                          <label className="form-label">Password</label>
                          <div className="Password-field">
                            <input
                              type="password"
                              id="password"
                              name="password"
                              className="form-control form-control-lg"
                              value={password}
                              onChange={handlePasswordChange}
                            />
                            <FontAwesomeIcon
                              icon={faCircleInfo}
                              onClick={handleIconClick}
                              className="Eye-icon"
                            />
                          </div>
                          <div className="progress mt-2">
                            <div
                              id="password-strength"
                              className={getProgressBarClassName()}
                              role="progressbar"
                              style={{ width: `${calculateProgressBarWidth()}%` }}
                              aria-valuenow={calculateProgressBarWidth()}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          {isDivVisible && (
                            <ul className="list-unstyled mt-3">
                              <li className="">
                                <span
                                  className={
                                    calculatePasswordStrength() >= 1 ? 'low-upper-case' : ''
                                  }
                                >
                                  {setIcon().lowercaseUppercase ? (
                                    <FontAwesomeIcon icon={faCheck} className="ul-check" />
                                  ) : (
                                    <FontAwesomeIcon icon={faCircle} className="ul-circle" />
                                  )}
                                  &nbsp;Lowercase &amp; Uppercase
                                </span>
                              </li>
                              <li className="">
                                <span>
                                  {setIcon().number ? (
                                    <FontAwesomeIcon icon={faCheck} className="ul-check" />
                                  ) : (
                                    <FontAwesomeIcon icon={faCircle} className="ul-circle" />
                                  )}
                                  &nbsp;Number (0-9)
                                </span>
                              </li>
                              <li className="">
                                <span
                                  className={
                                    calculatePasswordStrength() >= 3 ? 'one-special-char' : ''
                                  }
                                >
                                  {setIcon().specialCharacter ? (
                                    <FontAwesomeIcon icon={faCheck} className="ul-check" />
                                  ) : (
                                    <i className="fas faCircle" aria-hidden="true">
                                      <FontAwesomeIcon icon={faCircle} className="ul-circle" />
                                    </i>
                                  )}
                                  &nbsp;Special Character (!@#$%^&*)
                                </span>
                              </li>
                              <li className="">
                                <span
                                  className={
                                    calculatePasswordStrength() >= 4 ? 'eight-character' : ''
                                  }
                                >
                                  {setIcon().eightCharacter ? (
                                    <FontAwesomeIcon icon={faCheck} className="ul-check" />
                                  ) : (
                                    <FontAwesomeIcon icon={faCircle} className="ul-circle" />
                                  )}
                                  &nbsp;Atleast 8 Character
                                </span>
                              </li>
                            </ul>
                          )}
                        </div>

                        <div className="form-outline col-md-6 mb-4">
                          <label className="form-label">Repeat your password</label>
                          <input
                            type="password"
                            id="form3Example4cdg"
                            className="form-control form-control-lg"
                          />
                        </div>
                      </div>

                      <div className="form-check d-flex mb-3">
                        <label className="form-check-label">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="form2Example3cg"
                          />
                          I agree all statements in{' '}
                          <a href="#!" className="text-body">
                            <u>Terms of service</u>
                          </a>
                        </label>
                      </div>

                      <div className="d-flex col-sm-12 col-md-12 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 Signup-btn  text-body"
                        >
                          Register
                        </button>
                      </div>

                      <p className="text-center text-muted mt-3 mb-0">
                        Have already an account?{' '}
                        <a href="#/login" className="fw-bold text-body">
                          <u>Login here</u>
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
