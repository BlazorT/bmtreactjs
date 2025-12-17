/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useGmailImport } from 'src/hooks/useGmailImport';
import { useOutlookImport } from 'src/hooks/useOutlookImport';
import { useShowToast } from 'src/hooks/useShowToast';
import SpinnerOverlay from '../UI/SpinnerOverlay';
import ImportContactsGrid from './ImportContactsGrid';
import Button from '../UI/Button';

const MailOptionsModal = ({ isOpen, toggle: toggleMdl, recipientsList, getRecipientList }) => {
  const showToast = useShowToast();
  const {
    data: gmailData,
    loading: gmailDataLoading,
    error: gmailError,
    isSignedIn: isGoogleSignedIn,
    login: googleLogin,
    refetch: refetchGmailData,
    logout: googleLogout,
    isAuthInProgress: isGoogleAuthInProgress,
  } = useGmailImport();

  const {
    data: outlookData,
    loading: outlookDataLoading,
    error: outlookError,
    isSignedIn: isMicrosoftSignedIn,
    login: microsoftLogin,
    refetch: refetchOutlookData,
    logout: microsoftLogout,
    isAuthInProgress: isMicrosoftAuthInProgress,
  } = useOutlookImport();

  const [selectedOption, setSelectedOption] = useState(null);

  const loading = useMemo(
    () => gmailDataLoading || outlookDataLoading,
    [gmailDataLoading, outlookDataLoading],
  );

  const data = useMemo(
    () => (selectedOption === 1 ? gmailData : selectedOption === 2 ? outlookData : []),
    [gmailData, outlookData, selectedOption],
  );

  const error = useMemo(
    () => (selectedOption === 1 ? gmailError : selectedOption === 2 ? outlookError : null),
    [gmailError, outlookError, selectedOption],
  );

  useEffect(() => {
    if (error) {
      showToast(error || 'Something went wrong, try again later!', 'error');
    }
  }, [error, showToast]);

  const toggle = () => {
    toggleMdl();
    setSelectedOption(null);
  };

  const onGmailClick = () => {
    setSelectedOption(1);
    if (isGoogleSignedIn) refetchGmailData();
    else googleLogin();
  };

  const onOutlookClick = () => {
    setSelectedOption(2);
    if (isMicrosoftSignedIn) refetchOutlookData();
    else microsoftLogin();
  };

  const onUnlink = () => {
    setSelectedOption(null);
    if (selectedOption === 1) {
      googleLogout();
    } else if (selectedOption === 2) microsoftLogout();
  };

  const isProviderSelected = selectedOption === 1 || selectedOption === 2;
  const isLinked =
    (selectedOption === 1 && isGoogleSignedIn) || (selectedOption === 2 && isMicrosoftSignedIn);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={!isProviderSelected ? 'w-50' : 'w-50'}
      contentClassName="border-0 shadow-lg rounded-3 overflow-hidden"
    >
      <ModalHeader className="border-0 pb-2 pt-2 px-2 bg-gradient text-dark" toggle={toggle}>
        <div className="d-flex align-items-center gap-2 w-100">
          <h4 className="mb-0 fw-bold text-white">
            {!selectedOption
              ? 'Import Contacts From'
              : selectedOption === 1
                ? 'Gmail Contacts'
                : 'Outlook Contacts'}
          </h4>

          {isLinked && !loading && (
            <Button
              title="Unlink Account"
              className="btn-sm btn-outline-danger px-2 py-1 w-auto"
              onClick={onUnlink}
            />
          )}
        </div>
      </ModalHeader>

      <ModalBody className="p-2 mt-2">
        {/* Contacts Grid */}
        {isProviderSelected && data?.length > 0 && !loading && (
          <div className="">
            <ImportContactsGrid
              data={data}
              getRecipientList={getRecipientList}
              recipientsList={recipientsList}
            />
          </div>
        )}

        {/* Provider Selection */}
        {(!isProviderSelected || loading || data?.length === 0) && (
          <div className="text-center">
            <SpinnerOverlay
              show={loading || isGoogleAuthInProgress || isMicrosoftAuthInProgress}
              title={
                loading
                  ? 'Processing...'
                  : isGoogleAuthInProgress
                    ? 'Google Authentication In Progress...'
                    : isMicrosoftAuthInProgress
                      ? 'Microsoft Authentication In Progress...'
                      : ''
              }
            />

            <div className="row justify-content-center g-5">
              {/* Gmail Card */}
              <div className="col-md-5">
                <div
                  className={`card shadow-sm rounded-4 overflow-hidden cursor-pointer transform-transition hover-lift position-relative ${
                    selectedOption === 1 ? 'border border-success border-2' : ''
                  }`}
                  onClick={onGmailClick}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  {/* Checked Icon */}
                  {selectedOption === 1 && (
                    <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-success"
                      >
                        <circle cx="12" cy="12" r="10" fill="#4caf50" />
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                  )}

                  <div className="card-body p-2 text-center">
                    <div className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 48 48"
                        className="drop-shadow"
                      >
                        <path
                          fill="#4caf50"
                          d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
                        ></path>
                        <path
                          fill="#1e88e5"
                          d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
                        ></path>
                        <polygon
                          fill="#e53935"
                          points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
                        ></polygon>
                        <path
                          fill="#c62828"
                          d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
                        ></path>
                        <path
                          fill="#fbc02d"
                          d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z"
                        ></path>
                      </svg>
                    </div>
                    <h5 className="fw-bold text-white mb-2">Gmail</h5>
                    <p className="text-dim small mb-0">
                      {isGoogleSignedIn ? 'Connected' : 'Click to connect'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Outlook Card */}
              <div className="col-md-5">
                <div
                  className={`card shadow-sm rounded-4 overflow-hidden cursor-pointer transform-transition hover-lift position-relative ${
                    selectedOption === 2 ? 'border border-success border-2' : ''
                  }`}
                  onClick={onOutlookClick}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  {/* Checked Icon */}
                  {selectedOption === 2 && (
                    <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-success"
                      >
                        <circle cx="12" cy="12" r="10" fill="#4caf50" />
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                  )}

                  <div className="card-body p-2 text-center">
                    <div className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 48 48"
                        className="drop-shadow"
                      >
                        <path
                          fill="#03A9F4"
                          d="M21,31c0,1.104,0.896,2,2,2h17c1.104,0,2-0.896,2-2V16c0-1.104-0.896-2-2-2H23c-1.104,0-2,0.896-2,2V31z"
                        ></path>
                        <path
                          fill="#B3E5FC"
                          d="M42,16.975V16c0-0.428-0.137-0.823-0.367-1.148l-11.264,6.932l-7.542-4.656L22.125,19l8.459,5L42,16.975z"
                        ></path>
                        <path fill="#0277BD" d="M27 41.46L6 37.46 6 9.46 27 5.46z"></path>
                        <path
                          fill="#FFF"
                          d="M21.216,18.311c-1.098-1.275-2.546-1.913-4.328-1.913c-1.892,0-3.408,0.669-4.554,2.003c-1.144,1.337-1.719,3.088-1.719,5.246c0,2.045,0.564,3.714,1.69,4.986c1.126,1.273,2.592,1.91,4.378,1.91c1.84,0,3.331-0.652,4.474-1.975c1.143-1.313,1.712-3.043,1.712-5.199C22.869,21.281,22.318,19.595,21.216,18.311z M19.049,26.735c-0.568,0.769-1.339,1.152-2.313,1.152c-0.939,0-1.699-0.394-2.285-1.187c-0.581-0.785-0.87-1.861-0.87-3.211c0-1.336,0.289-2.414,0.87-3.225c0.586-0.81,1.368-1.211,2.355-1.211c0.962,0,1.718,0.393,2.267,1.178c0.555,0.795,0.833,1.895,0.833,3.31C19.907,24.906,19.618,25.968,19.049,26.735z"
                        ></path>
                      </svg>
                    </div>
                    <h5 className="fw-bold text-white mb-2">Outlook</h5>
                    <p className="text-dim small mb-0">
                      {isMicrosoftSignedIn ? 'Connected' : 'Click to connect'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isProviderSelected && data?.length === 0 && !loading && (
              <div className="mt-5">
                <p className="text-dim lead">No contacts found in your account.</p>
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default MailOptionsModal;
