// React and third-party libraries
import React, { useState } from 'react';

import CIcon from '@coreui/icons-react';
import Carousel from 'react-bootstrap/Carousel';

import { useLocation, useNavigate } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'reactstrap';
import { cilChevronRight } from '@coreui/icons';

import globalutil from '../../util/globalutil';

// local imports
import Loading from '../../components/UI/Loading';
import Fotter from 'src/layout/AppFooter.js';
import useFetch from 'src/hooks/useFetch.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectToast, updateToast } from 'src/redux/toast/toastSlice';
import CustomSnackbar from 'src/components/UI/CustomSnackbar';
import { setUserData } from 'src/redux/user/userSlice';
import { getCountryById } from 'src/constants/countries_and_states';
import { transformData } from 'src/navItem';
import { setNavItems, setPageRoles } from 'src/redux/navItems/navItemsSlice';

function SignIn() {
  // const { response, error, loading, fetchData } = useFetch('/storeusers');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useSelector(selectToast);

  const {
    response: utilRes,
    error: utilErr,
    loading: utilLoading,
    fetchData: fetchUtils,
  } = useFetch();

  const {
    response: menuRes,
    error: menuErr,
    loading: menuLoading,
    fetchData: fetchMenus,
  } = useFetch();

  const {
    response: loginRes,
    error: loginErr,
    loading: loginLoading,
    fetchData: userLogin,
  } = useFetch();

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userDetail, setuserDetail] = useState({
    storeName: '',
    storeId: null,
    userName: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    setErrorMessage('');
    const { name, value } = event.target;
    setuserDetail((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const addGlobalUtils = (data) => {
    globalutil.setdastatuses(data.dastatuses);
    globalutil.setstates(data.states);
    globalutil.setmakes(data.makes);
    globalutil.setuserroles(data.userroles);
    globalutil.setcountries(data.countries);
    globalutil.setbusinesstypes(data.businesstypes);
    globalutil.setproductgroups(data.productgroups);
    globalutil.setsubstatuses(data.substatuses);
    globalutil.setauditentities(data.auditentities);
    globalutil.setbusinessentities(data.businessentities);
    globalutil.setnotificationtypes(data.notificationtypes);
    globalutil.setsubstatuses(data.categories);
    globalutil.setservicetypes(data.servicetypes);
    globalutil.setvehicletypes(data.vehicletypes);
    globalutil.setownerships(data.ownerships);
    globalutil.setmenus(data.menus);
    globalutil.setcommonstatuses(data.commonstatuses);
    globalutil.setvehiclestatuss(data.vehiclestatuss);
    globalutil.setinspectionstatuses(data.inspectiontypes);
    globalutil.setinspectionitems(data.inspectionitems);
    globalutil.setdatatypes(data.datatypes);
    globalutil.setfieldtypes(data.fieldtypes);
    globalutil.setsynchstatuses(data.synchstatuses);
    globalutil.setrostertypes(data.rostertypes);
    globalutil.setdsP_TABLES(data.dsP_TABLES);
    globalutil.setproduct_assignment_types(data.product_assignment_types);
  };

  const getUtils = async () => {
    await fetchUtils('/Common/lovs');

    if (utilRes?.current?.status === true) {
      console.log(utilRes.current.data);
      addGlobalUtils(utilRes.current.data);
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
  };
  const getMenus = async () => {
    const menuBody = {
      roleId: loginRes.current?.data.roleId.toString(),
    };

    await fetchMenus('/Common/rolemenus', { method: 'POST', body: JSON.stringify(menuBody) });
    if (menuRes?.current?.status === true) {
      dispatch(setPageRoles(menuRes?.current.data));
      dispatch(setNavItems(transformData(menuRes?.current.data)));
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
  };
  const LoginClick = async (event) => {
    event.preventDefault();
    if (userDetail.userName === '' || userDetail.password === '') {
      setErrorMessage('Username & password are mandatory !');
      setIsLoading(false);
      return;
    } else {
      setIsLoading(true);
      await userLogin(
        `/Common/login?email=${userDetail.userName}&password=${userDetail.password}`,
        { method: 'POST' },
      );
      //
      if (loginRes.current?.status === true) {
        getUtils();
        getMenus();
        setModalOpen(true);
      } else if (loginRes.current?.status === 400) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: loginRes.current.message,
            toastVariant: 'error',
          }),
        );
        setIsLoading(false);
      } else {
        setErrorMessage(loginRes.current.message);
        setIsLoading(false);
      }
    }
  };

  const RegisterClick = () => {
    navigate('/dspRegister');
  };
  const JoinUsDA = () => {
    navigate('/applyForm');
  };
  const ClickProceed = () => {
    dispatch(
      setUserData({
        userId: loginRes.current.data.id,
        dspId: loginRes.current.data.dspId,
        roleId: loginRes.current.data.roleId,
        userInfo: loginRes.current.data,
        isAuthenticated: true,
      }),
    );
    if (location.state?.redirectPath) navigate(location.state.redirectPath.pathname);
    else navigate('/dashboard');

    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: loginRes.current.message,
        toastVariant: 'success',
      }),
    );
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
        <video controls={false} autoPlay={true} muted={true} className="landingPicView">
          <source src="BackgroundVideo.mp4" type="video/mp4" />
        </video>
        <div className="col-12 col-md-8 col-lg-6 col-xl-5 LoginCardOverlayImg">
          <div className="LoginCardOverlayImg2ndView">
            <div className="card-body p-3 text-center">
              <img className="LogoStyl mb-2" src="4dspslogo.svg" alt="logo" />
              <br />
              <strong className="signin-text labelName"> 4DSPS Sign in </strong>
              <form>
                <div className="form-outline mb-2 mt-2 text-start">
                  <label htmlFor="" className="login_label mb-1 labelName">
                    User name
                  </label>
                  <input
                    type="text"
                    className="form-control item bgTextbox"
                    id="username"
                    onChange={handleChange}
                    value={userDetail.userName}
                    name="userName"
                    placeholder="Username"
                  />
                </div>
                <div className="form-outline mb-1 text-start">
                  <label htmlFor="" className="login_label mb-1 labelName">
                    Password
                  </label>
                  <div className="Password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control bgTextbox item"
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
                {errorMessage && (
                  <p dangerouslySetInnerHTML={{ __html: errorMessage }} className="error-message" />
                )}
                <div className="form-group login-btn d-flex  flex-column align-items-end ">
                  <p
                    className="forgot-password-login-label"
                    onClick={() => navigate('/forgot-password')}
                    style={{ width: '9em' }}
                  >
                    Forgot Password?
                  </p>

                  <button
                    type="submit"
                    onClick={(e) => LoginClick(e)}
                    className="btn signin-btn labelName"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="LoginCardOverlayImg3ndView">
            <img className="poweredbyStyl" src="poweredbyaws.png" alt="logo" />
            <div className="text-center labelName mt-2">
              ©2023{' '}
              <a onClick={toggleModal} className="underline labelName">
                6BY7, LLC
              </a>
            </div>
            <p className="pt-1 CardOverlaylbl labelName">
              {' '}
              4DSPS is affiliated with Amazon or its subsidiaries.
            </p>
          </div>
        </div>
        <div className="ContainerView">
          <div className="CarousalMainDiv row py-3 d-flex align-items-center">
            <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5">
              <Carousel data-bs-theme="dark">
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousalImg"
                    src="carouselImg5.png"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h5>Tips for the Amazon</h5>
                    <p>
                      {' '}
                      While Amazon provides access to tools and mentorship to help you hit the
                      ground running
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousalImg"
                    src="carouselImg4.png"
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h5>Delivery Service</h5>
                    <p> As a DSP, you are only as strong as your team of delivery associates. </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousalImg"
                    src="carouselImg3.png"
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h5>Partner Application</h5>
                    <p>
                      Your leadership won’t just set them up for success on the road today, but
                      wherever their career takes them.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5 carousalImg">
              <h5 className="MainHeading pb-2">Opportunity To Lead</h5>
              <p className="lineHeight">
                An opportunity to lead As a DSP, you are only as strong as your team of delivery
                associates. Your leadership won’t just set them up for success on the road today,
                but wherever their career takes them. Successful candidates are passionate about
                hiring and coaching, building a strong company culture, and giving back to the
                community. A partnership with momentum While Amazon provides access to tools and
                mentorship to help you hit the ground running and ensure that your delivery
                associates have a safe work environment, you can expect to run a seasonal business
                that is always evolving. When you’re at the forefront of change with Amazon,
                innovation never stops.
              </p>
            </div>
          </div>
          <div className="SeprateDiv"> </div>
          <div className="CarousalMainDiv row py-3 d-flex align-items-center">
            <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5 carousalImg">
              <h5 className="MainHeading pb-2">Partnership With Momentum</h5>
              <p className="lineHeight">
                A partnership with momentum While Amazon provides access to tools and mentorship to
                help you hit the ground running and ensure that your delivery associates have a safe
                work environment, you can expect to run a seasonal business that is always evolving.
                When you’re at the forefront of change with Amazon, innovation never stops. As a
                DSP, you are only as strong as your team of delivery associates. Your leadership
                won’t just set them up for success on the road today, but wherever their career
                takes them. Successful candidates are passionate about hiring and coaching, building
                a strong company culture, and giving back to the community.
              </p>
            </div>
            <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5">
              <Carousel data-bs-theme="dark">
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousalImg"
                    src="landingBackground2.png"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h5>Delivery Service</h5>
                    <p>
                      {' '}
                      A partnership with momentum While Amazon provides access to tools and
                      mentorship to help you hit the ground running.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousalImg"
                    src="carouselImg4.png"
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h5>Partner Application</h5>
                    <p>
                      Powered bulkhead door that opens when drivers reach their delivery location.
                      Ventilated seats for fast heating and cooling.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousalImg"
                    src="carouselImg2.png"
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h5>Tips for the Amazon</h5>
                    <p>
                      While Amazon provides access to tools and mentorship to help you hit the
                      ground running and ensure that your delivery associates have a safe work
                      environmen.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
          <Modal
            isOpen={modalOpen}
            toggle={toggleModal}
            className="custom-modal PROCEEDModal"
            backdrop={false}
          >
            <video controls={false} autoPlay={true} muted={true} className="ProceedLandingVid">
              <source src="BackgroundVideo.mp4" type="video/mp4" />
            </video>
            <div className="DSPLandingproceedView row">
              <div className="col-md-2">
                <img
                  className="DSPLandingproceedLogo"
                  src={
                    loginRes.current?.data?.dspLogo
                      ? loginRes.current.data.dspLogo
                      : '4dspslogo.svg'
                  }
                  alt="logo"
                />
                <br />
              </div>
              <div className="col-md-10 mt-2">
                <strong className="PROCEEDTitle">
                  {loginRes.current?.data?.dspName}, {loginRes.current?.data?.dspStateName} ,
                  {getCountryById(loginRes.current?.data?.dspStateId)}
                </strong>
                <p className="DSPLandingproceedViewPara">
                  An opportunity to lead As a DSP, you are only as strong as your team of delivery
                  associates. Your leadership won’t just set them up for success on the road today,
                  but wherever their career takes them. Successful candidates are passionate about
                  hiring and coaching, building a strong company culture, and giving back to the
                  community.
                </p>
                <button
                  onClick={ClickProceed}
                  type="submit"
                  className="btn btn_Default minWidth sales-btn-style mb-3"
                >
                  PROCEED <CIcon className="stock-toggle-icon" icon={cilChevronRight}></CIcon>
                  <CIcon className="stock-toggle-icon" icon={cilChevronRight}></CIcon>{' '}
                </button>
              </div>
            </div>
          </Modal>
          <div className="SeprateDiv"> </div>
          <Fotter />
        </div>
      </section>
      <CustomSnackbar
        message={toast.toastMessage}
        variant={toast.toastVariant}
        open={toast.isToastOpen}
        setOpen={() =>
          dispatch(
            updateToast({
              isToastOpen: false,
            }),
          )
        }
      />
    </>
  );
}

export default SignIn;
