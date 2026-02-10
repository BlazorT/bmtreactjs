// React and third-party libraries
import React, { useEffect, useState } from 'react';
//import CIcon from '@coreui/icons-react';
import Carousel from 'react-bootstrap/Carousel';
import { useLocation, useNavigate } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { Modal } from 'reactstrap';
//import { cilChevronRight } from '@coreui/icons';

import globalutil from '../../util/globalutil';
// local imports
import Loading from '../../components/UI/Loading';
import Fotter from 'src/layout/AppFooter.js';
import useFetch from 'src/hooks/useFetch.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectToast, updateToast } from 'src/redux/toast/toastSlice';
import { setUserData } from 'src/redux/user/userSlice';
//import { getCountryById } from 'src/constants/countries_and_states';
import { transformData } from 'src/navItem';
import { setNavItems, setPageRoles } from 'src/redux/navItems/navItemsSlice';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import useApi from 'src/hooks/useApi';
import dayjs from 'dayjs';

function SignIn() {
  // const { response, error, loading, fetchData } = useFetch('/storeusers');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useSelector(selectToast);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.isAuthenticated) navigate('/Dashboard');
  }, []);

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

  const { postData: getOrgs, loading: orgLoading } = useApi('/BlazorApi/orgsfulldata');

  const { postData: getSocialApiKey, loading: socialApiKeyLoading } = useApi(
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_BMT_SERVIVE + '/auth/login',
  );

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [userDetail, setuserDetail] = useState({
    fullName: '',
    password: '',
  });

  const { postData: userLogin, loading: loginLoading } = useApi(
    `/Common/login?email=${userDetail.fullName}&password=${userDetail.password}`,
  );

  const fetchSocialApiKey = async (email, password) => {
    try {
      const { response: data } = await getSocialApiKey(
        {
          email,
          password,
        },
        true,
      );

      if (data?.token) return data?.token;
      return null;
    } catch (error) {
      return null;
    }
  };

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
    globalutil.setnetworks(data.networks);
    globalutil.setstates(data.states);
    globalutil.setstatuses(data.statuses);
    globalutil.setintervals(data.intervals);
    globalutil.setcountries(data.countries);
    globalutil.setcategories(data.categories);
    globalutil.setalerts(data.alerts);
    globalutil.setpackages(data.packages);
    globalutil.setCurrencies(data.currencies);
    globalutil.setPostTypes(data.postTypes);
    globalutil.setmenus(data.menus);
    globalutil.setservicetypes(data.servicetypes);
    globalutil.setcommonstatuses(data.commonstatuses);
    globalutil.setauditentities(data.auditentities);
    globalutil.setuserroles(data.userroles);
    globalutil.setbusinessentitiess(data.businessentities);
    globalutil.setbusinesstypes(data.businesstypes);
    globalutil.setdeliverstatus(data.deliverstatus);
    globalutil.setcampaignunits(data.campaignunits);
  };

  const getUtils = async () => {
    await fetchUtils('/Common/lovs');
    if (utilRes?.current?.status === true) {
      console.log(utilRes.current.data, 'util');
      addGlobalUtils(utilRes.current.data);
    }
  };

  useEffect(() => {
    getUtils();
  }, []);

  const getMenus = async (roleId) => {
    const menuBody = {
      roleId,
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
    if (userDetail.fullName === '' || userDetail.password === '') {
      setErrorMessage('Username & password are mandatory !');
      return;
    } else {
      // 🔍 log it in readable JSON

      const loginRes = await userLogin();

      if (loginRes?.status === true) {
        getUtils();
        getMenus(loginRes?.data.roleId.toString());

        const socialApiKey = await fetchSocialApiKey(userDetail.fullName, userDetail.password);
        const data = await getOrgs({
          id: loginRes?.data?.orgId,
          roleId: 0,
          orgId: 0,
          email: '',
          name: '',
          contact: '',
          rowVer: 0,
          cityId: 0,
          status: 0,
          createdAt: dayjs().utc().subtract(100, 'year').format('YYYY-MM-DD'),
          lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
          createdBy: 0,
          lastUpdatedBy: 0,
        });
        setModalOpen(true);
        ClickProceed(data?.data?.[0] || {}, socialApiKey, loginRes);
      } else if (loginRes?.status === 400) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: loginRes?.message,
            toastVariant: 'error',
          }),
        );
      } else {
        // alert(JSON.stringify(loginRes.current));
        setErrorMessage(loginRes?.message);
      }
    }
  };
  const ClickProceed = (orgInfo, socialApiKey, loginRes) => {
    dispatch(
      setUserData({
        userId: loginRes.data.id,
        roleId: loginRes.data.roleId,
        orgId: loginRes.data.orgId,
        userInfo: loginRes.data,
        orgInfo,
        isAuthenticated: true,
        socialApiKey: socialApiKey || '',
      }),
    );
    if (loginRes?.data?.roleId === 2 && !orgInfo?.signature) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'To proceed, review and sign the aggreement.',
          toastVariant: 'warning',
        }),
      );
      navigate('/organizationadd', { state: { id: orgInfo?.id, org: [orgInfo] } });
      return;
    }
    if (location.state?.redirectPath) navigate(location.state.redirectPath.pathname);
    else navigate('/dashboard');

    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: loginRes?.message,
        toastVariant: 'success',
      }),
    );
  };

  return (
    <>
      {(orgLoading || loginLoading || socialApiKeyLoading) && (
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
              <div>
                <strong className="signin-text-style labelName"> Blazor Media Toolkit </strong>
              </div>
              <div className="pt-2">
                <strong className="signin-text-style labelName"> BMT </strong>
              </div>
              <form>
                <div className="form-outline mb-2 mt-2 text-start">
                  <label htmlFor="" className="login_label mb-1 labelName">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control item bgTextbox"
                    id="fullName"
                    onChange={handleChange}
                    value={userDetail.fullName}
                    name="fullName"
                    title="User Name | Email e.g abc@gmail.com"
                    placeholder="User Name | Email e.g abc@gmail.com"
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
          <div className="LoginCardOverlayImg3ndView mt-2 mb-2">
            {/*  <img className="poweredbyStyl" src="poweredbyaws.png" alt="logo" />*/}
            <div className="text-center Copyrights-labelName">
              © 2020{' '}
              <a onClick={toggleModal} className="underline Copyrights-labelName">
                Blazor Media Toolkit(BMT).
              </a>
            </div>
            <p className="pt-1 Copyrights-labelName"> all rights reserved</p>
          </div>
        </div>
        <div className="ContainerView">
          <div className="section">
            <div className="container ContainerView">
              <div className="CarousalMainDiv row py-3 d-flex align-items-center">
                <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5">
                  <Carousel controls={false} indicators={false} data-bs-theme="dark">
                    <Carousel.Item>
                      <img className="d-block w-100 carousalImg" src="BDMT.png" alt="First slide" />
                      <Carousel.Caption>
                        <h5>Tips for the Amazon</h5>
                        <p>
                          {' '}
                          While Amazon provides access to tools and mentorship to help you hit the
                          ground running
                        </p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </div>
                <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5 carousalImg">
                  <h5 className="MainHeading pb-2">Social Media Campaign</h5>
                  <p className="lineHeight">
                    Blazor Media Toolkit Campaign plays nice with others and integrates with over
                    700 apps and services like whatsapp,facebook,tweeter,messenger,youtube etc. From
                    accounting to CMS and analytics applications, all the way to services that are
                    focused on sales, support and lead generation. Visit their website and try out
                    their platform for free to find out if Blazor Media Campaign(BMC) is the right
                    solution to help grow your ....
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="SeprateDiv"> </div>
          <div className="section">
            <div className="container ContainerView">
              <div className="CarousalMainDiv row py-3 d-flex align-items-center">
                <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5 carousalImg">
                  <h2>
                    <span className="txtColor">Blazor</span> Media Toolkit{' '}
                  </h2>
                  {/*<h5 className="MainHeading pb-2">Partnership With Momentum</h5>*/}
                  <ul className="liFontsize">
                    <li>Facebook</li>
                    <li>WhatsApp</li>
                    <li>Twitter</li>
                    <li>SMS</li>
                    <li>Email</li>
                    <li>Linkedin</li>
                    <li>TikTok</li>
                    <li>Snapchat</li>
                    <li>Instagram</li>
                  </ul>
                </div>
                <div className="CarousalDiv col-12 col-md-6 col-lg-6 col-xl-5">
                  <Carousel controls={true} indicators={false} data-bs-theme="dark">
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="email.png"
                        alt="First slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p> Email</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="whatsapp.jpg"
                        alt="Second slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>Whatsapp</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="instagram.png"
                        alt="Third slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>Instagram</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="linkedin.jpg"
                        alt="Fourth slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>LinkedIn</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="realtwiter.jpg"
                        alt="Third slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>Twitter</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="tiktok.png"
                        alt="Fifth slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>Tiktok</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 carousalImg"
                        src="snapchat.png"
                        alt="seventh slide"
                      />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>Snapchat</p>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img className="d-block w-100 carousalImg" src="fb.jpg" alt="sixth slide" />
                      <Carousel.Caption>
                        <h5>Blazor Media Toolkit</h5>
                        <p>Facebook</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </div>
              </div>
            </div>
          </div>

          <div className="SeprateDiv"> </div>

          <section id="Reviews" className="backgrdClr">
            <div className="container">
              <div className="row pb-2 pt-2">
                <div className="col-lg-12 col-md-12">
                  <div className="sec-heading center" style={{ textAlign: 'center' }}>
                    <h2 className="sec-heading center">Our Endorsements</h2>
                  </div>
                </div>
              </div>
              <div className="card-deck">
                <div className="card clientCardPadding">
                  <div className="clientImgBackgroundClr">
                    <img
                      className="card-img-top clientImg"
                      src="Michael-Azran.jpg"
                      alt="Michael-Azran"
                    />
                  </div>
                  <div className="card-body rounded-0 clientBodyBackgroundClr">
                    <span className="card-title AdvisorName">Michael-Azran</span>
                    <br />
                    <p className="ClientPost">Michael-Azran, BDN, Canada</p>
                    <p className="card-text ClientReview">
                      Excellent performance.It was pleasure to work with Blazor.Knowledgeable and
                      helpful professionals!.
                    </p>
                  </div>
                </div>
                <div className="card clientCardPadding">
                  <div className="clientImgBackgroundClr">
                    <img
                      className="card-img-top clientImg"
                      src="qaiser.jpeg"
                      alt="Qaiser Mehmood"
                    />
                  </div>
                  <div className="card-body rounded-0 clientBodyBackgroundClr">
                    <span className="card-title AdvisorName">Qaiser Mehmood</span>
                    <br />
                    <p className="ClientPost">Qaiser Mehmood, Delware,USA </p>
                    <p className="card-text ClientReview">
                      When i had a problem,recieved quick, prompted and issue resolving response
                      from Blazor
                    </p>
                  </div>
                </div>
                <div className="card clientCardPadding">
                  <div className="clientImgBackgroundClr">
                    <img
                      className="card-img-top clientImg"
                      src="ymc.jpg"
                      alt="Taymullah Abdul Rehman"
                    />
                  </div>
                  <div className="card-body rounded-0 clientBodyBackgroundClr">
                    <span className="card-title AdvisorName">Youngs Merchant Club</span>
                    <br />
                    <p className="ClientPost">Taymullah Abdul Rehman, Co-Founder, YMC LLC</p>
                    <p className="card-text ClientReview">
                      Excellent work,dedication, delivered beyond expected,iam highly satisfy with
                      them,will continue working with Blazor team for sure!!!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="SeprateDiv"> </div>
          <Fotter />
        </div>
      </section>
    </>
  );
}

export default SignIn;
