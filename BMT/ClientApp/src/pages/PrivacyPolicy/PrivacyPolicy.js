import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { updateToast } from 'src/redux/toast/toastSlice';
import { getBusinessTypeById } from 'src/constants/buisnessType';
import { getCountryById, getStateById } from 'src/constants/countries_and_states';
//import globalutil from 'src/util/globalutil';
import useFetch from 'src/hooks/useFetch';
import Loading from 'src/components/UI/Loading';

const PrivacyPolicy = (prop) => {
  dayjs.extend(utc);
  useEffect(() => {
    fetchDspList();
  }, []);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const {
    response: dspsListRes,
    loading: dspsLoading,
    error: dspsError,
    fetchData: fetchDsps,
  } = useFetch();

  const [filters, setFilters] = useState({
    keyword: '',
    businessTypeId: '',
    stateId: '',
    country: '',
    createdAt: dayjs().utc().startOf('year').format()
  });

 
  const [showLicence, setShowLicence] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
 
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    {
      sr: 1,
      id: 1,
      firstName: 'John Doe',
      lastName: '',
      contact: '03456456546',
      country: 'pakistan',
      state: 'punjab',
      businessType: 'Partnership',
      partners: '3',
      fleet: '2',
    },
    {
      sr: 2,
      id: 3,
      firstName: 'John Smith',
      lastName: '',
      contact: '03456456546',
      country: 'pakistan',
      state: 'punjab',
      businessType: 'Partnership',
      partners: '3',
      fleet: '2',
    },
  ]);
  const [columns] = useState([
    {
      field: 'firstName',
      headerName: 'Name',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 95,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 110,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: 'country',
      headerName: 'Country',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 80,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: 'state',
      headerName: 'State',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 70,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      hide: true,
    },
    {
      field: 'businessType',
      headerName: 'Business Type',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 130,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: 'partners',
      headerName: 'Partners',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 80,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: 'fleet',
      headerName: 'Fleet',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      editable: false,
      minWidth: 60,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
    },
    //{
    //  field: 'status',
    //  headerName: 'Action',
    //  headerClassName: 'custom-header-data-grid',
    //  flex: 1,
    //  minWidth: 160,
    //  editable: false,
    //  filterable: false,
    //  sortable: true,
    //  disableColumnMenu: true,
    //  renderCell: (params) => (
    //    //<DADSspsListCell
    //    //  value={params}
    //    //  fetchDspList={fetchDspList}
    //    //  user={dspsListRes.current?.data?.data.filter((item) => item.id === params.row.id)}
    //    ///>
    // // ),
    //},
  ]);

  
  const fetchDspList = async (filter) => {
    const dspsBody = {
      dspid: user.roleId === 1 ? 0 : user.dspId,
      name: '',
      address: '',
      contact: '',
      email: '',
      rowVer: 0,
      ...filter,
    };
    await fetchDsps('/BlazorApi/dspsfulldata', { method: 'POST', body: JSON.stringify(dspsBody) });

    if (dspsListRes.current?.data?.status === true) {
      if (dspsListRes.current.data.data.length == 0) {
        setRows([]);
      } else {
        const mappedArray = dspsListRes.current.data.data.map((data, index) => ({
          sr: index + 1,
          id: data.id,
          firstName: data.firstName !== null ? data.name : ' ' + data.name,
          contact: data.contact,
          country: data.stateId && getCountryById(data.stateId),
          state: data.stateId && getStateById(data.stateId),
          businessType: data.businessTypeId ? getBusinessTypeById(data.businessTypeId) : '',
          partners: data.partnersCount,
          status: data.status,
          fleet: data.fleet,
        }));
        setRows(mappedArray);
      }
    } else if (dspsListRes?.current?.status === 400) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
      setRows([]);
    }
    setIsLoading(dspsLoading.current);
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

 
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="job-application-form">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="bg_Div mt-2 d-flex flex-column ">
                {showLicence == true ? (
                  <div className="show-stock">
                    <div className="row">
                      <div className="login-form" id="printTermsOfUse">
                        <h2 className="labelName">Privacy Policy</h2>
                        <div className="BodyDivPadding">
                          <strong className="TROUSStrong">
                            Vehicle-share Guidelines and Privacy Policy
                          </strong>
                          <p className="TROUSParagraph">
                            Blazor Media Toolkit is created in the spirit of peaceful civic engagement. We do not
                            permit the use of bigoted language, anti-government or anti-law
                            enforcement rhetoric or the provocation of violence of any kind. BMT
                            bears no tolerance for objectionable content or abusive users. We
                            reserve the right to not post any vehicle that we deem inappropriate or
                            subversive to the spirit of our platform.
                          </p>
                          <strong className="TROUSStrong underline">Do not</strong>
                          <strong className="TROUSStrong"> post, upload, stream, or share:</strong>
                          <ul>
                            <li>
                              <p className="TROUSParagraph">
                                Content that boasts, praise or promotes past, present, or future
                                crimes
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Unnecessary graphic details of crimes
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Yours or anyone else’s’ legal paperwork including court documents,
                                victim documents or official documents from government agencies
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Admissions of guilt for crimes you have not been convicted of
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Names of individuals other than yourself or the loved one you are
                                speaking on behalf of
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Individual personal addresses of you or anyone else
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Names of victims, co-defendants, witnessed or perpetrators nor names
                                of specific correctional officers
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that encourages aggressive / angry words or actions directed
                                at public officials, officers of the court, correctional officers,
                                judges or any employee of the state
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Gang names, symbols, flags, logos or gestures
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that ridicules victims or their families
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Firearms or weapons of any kind including ammunition and / or
                                accessories
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that depicts or promotes the usage of drugs, and or alcohol
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that solicits money or financial assistance for you, your
                                loved one or any one at all
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that expresses, insinuates, or hints at the guilt of
                                non-convicted citizens
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">Explicit language</p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Violent threats against any individual or entity of any kind
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">Nudity or obscenity</p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that equates to conspiracy theories
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">Misinformation, lies or half-truths</p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Personal medical records of you or anyone else
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Personal identity information such as bank account information, bank
                                statements, social security numbers and/or card, drivers license or
                                any other sensitive content of similar nature
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Personal login codes, names or passwords for you or anyone else
                              </p>
                            </li>
                            <li>
                              <p className="TROUSParagraph">
                                Content that violates or infringes on someone else’s legally held
                                copyright, trademark, intellectual property or patten
                              </p>
                            </li>
                          </ul>
                          <strong className="TROUSStrong pt-2">Content Integrity</strong>
                          <ul>
                            <p className="TROUSParagraph">
                              BMT expects every vehicle-share to contain authentic stories of
                              truthfulness and honesty without lies fabrications or exaggerations.
                            </p>
                          </ul>
                          <ul>
                            <p className="TROUSParagraph">
                              BMT is not responsible for stories or details within a story that
                              may turn out to be falsified by the vehicle-share.
                            </p>
                          </ul>
                          <ul>
                            <p className="TROUSParagraph">
                              BMT reserves the right to inquire with family, friends, law
                              enforcement and policymakers about the truthfulness of your story
                              including generalizations and / or details pertaining to people,
                              places, things, and situations. We understand that situational
                              evidence is subjective and that there may be numerous views and
                              opinions about the same incident. If however, BMT discovers that any
                              part of your story is false, your account will be suspended and your
                              vehicle removed permanently.
                            </p>
                          </ul>
                          <p className="TROUSParagraph pt-2">
                            <strong className="TROUSStrong">Last Updated:</strong> February 14, 2023
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
        
          </form>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicy;
