import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

import Loading from '../../components/UI/Loading';

const Login = () => {
  const [isSearchable, setIsSearchable] = useState(true);
  const [isClearable, setIsClearable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [userDetail, setuserDetail] = useState({
    storeName: '',
    storeId: null,
    userName: '',
    password: '',
  });
  const navigate = useNavigate();
  const storeRef = useRef(null);
  useEffect(() => {
    // fetchStores();
    storeRef.current.focus();
  }, []);

  const fetchStores = async () => {
    const data = {
      storeid: '0',
      name: '',
      remarks: '',
      id: '0',
      status: '1',
    };
    try {
      const response = await fetch('/BlazorApi/stores', {
        method: 'POST',
        headers: {
          Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      if (jsonData.data !== 0) {
        setStores(jsonData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleStoreChange = (event) => {
    if (event != null) {
      setuserDetail((prevdata) => ({
        ...prevdata,
        storeName: event.label,
        storeId: event.value,
      }));
    } else {
      setuserDetail((prevdata) => ({
        ...prevdata,
        storeName: '',
        storeId: null,
      }));
    }
  };

  const handleChange = (event) => {
    setErrorMessage('');
    const { name, value } = event.target;
    setuserDetail((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const login = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    var pass = '';
    if (userDetail.storeId >= 1) {
      if (userDetail.userName === '' || userDetail.password === '') {
        setErrorMessage('Incorrect Username or Password');
        setIsLoading(false);
        return;
      }
      pass = btoa(userDetail.password);
      const Checklogin = {
        storeid: String(userDetail.storeId),
        loginname: userDetail.userName,
        password: String(pass),
      };
      try {
        const response = await fetch('/BlazorApi/storeusers', {
          method: 'POST',
          headers: {
            Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Checklogin),
        });
        const jsonData = await response.json();

        if (jsonData.status == true) {
          setErrorMessage('');
          addUserToCookies();
          setIsLoading(false);
          navigate('/dashboard');
        } else {
          setIsLoading(false);
          setErrorMessage('Incorrect Username or Password');
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    } else {
      setIsLoading(false);
      setErrorMessage('Please Select Store');
    }
  };

  const addUserToCookies = () => {
    // Set the cookie expiration date to 7 days from the current date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // Construct the cookie string with the user's email and expiration date
    const usernameCookie = `loggedInUser=${encodeURIComponent(
      userDetail.userName,
    )}; expires=${expirationDate.toUTCString()};path=/`;
    const storeIdCookie = `storeId=${encodeURIComponent(
      userDetail.storeId,
    )}; expires=${expirationDate.toUTCString()};path=/`;

    // Set the cookies
    document.cookie = usernameCookie;
    document.cookie = storeIdCookie;
    // Set the cookie
  };
  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}
      <section>
        <div className="container py-3">
          <div className="row d-flex justify-content-center align-items-center ">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong ">
                <div className="card-body p-3 text-center">
                  <img className="" src="4DSPSLogoTransparent.png" alt="logo" />
                  <p className="pt-3 signin-text"> BMT Sign in check</p>
                  <form>
                    <Select
                      style="display:none;"
                      className="text-start"
                      ref={storeRef}
                      placeholder="Select Store"
                      isSearchable={isSearchable}
                      isClearable={isClearable}
                      onChange={handleStoreChange}
                      options={stores.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                    />
                    <div className="form-outline mb-2 mt-2 text-start">
                      <label htmlFor="" className="login_label mb-2">
                        User name
                      </label>
                      <input
                        type="text"
                        className="form-control item border border-danger"
                        id="username"
                        onChange={handleChange}
                        value={userDetail.userName}
                        name="userName"
                        placeholder="Username"
                      />
                    </div>

                    <div className="form-outline mb-2 text-start">
                      <label htmlFor="" className="login_label mb-2 ">
                        Password
                      </label>
                      <div className="Password-field">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control item"
                          value={userDetail.password}
                          onChange={handleChange}
                          name="password"
                          placeholder="Password"
                        />
                        <FontAwesomeIcon
                          onClick={togglePasswordVisibility}
                          icon={showPassword ? faEyeSlash : faEye}
                          className="Eye-icon"
                        />
                      </div>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-group text-end">
                      <a href="">Forgot Password?</a>
                    </div>
                    <div className="form-group login-btn">
                      <button type="submit" onClick={login} className="btn btn-primary  signin-btn">
                        Sign in
                      </button>
                    </div>
                  </form>
                  <hr className="my-2 mt-3" />
                  <div className="login-footer">
                    <p>
                      Dont have an account?{' '}
                      <a href="#/register" className="fw-bold text-body go-signup ">
                        Sign Up{' '}
                      </a>
                    </p>
                  </div>
                  <hr className="my-2" />
                  <div className="login-footer">
                    <p className="mb-0">© 2023 BMT All Rights Reserved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="animation-div">
          <div className="air air1"></div>
          <div className="air air2"></div>
          <div className="air air3"></div>
          <div className="air air4"></div>
        </div>
      </section>
    </>
  );
};

export default Login;
