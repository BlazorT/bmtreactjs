import React, { useState, useEffect, useRef } from 'react';
import useFetch from 'src/hooks/useFetch';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { CCol, CRow, CFormCheck } from '@coreui/react';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import { useShowToast } from 'src/hooks/useShowToast';

const Unsubscribe = (prop) => {
  const { isOpen, toggle } = prop;
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showToast = useShowToast();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeInputEnabled, setCodeInputEnabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const { fetchData } = useFetch();
  const TermsModal = () => setTermsmodalOpen(prev => !prev);

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer]);

  const handleGetCode = async () => {
    if (!email) {
      showToast('Email is required', 'warning');
      return;
    }
  
    setLoading(true);

    const body = {
      Email: email,
      SecurityToken: '',
      Status: 1,
      Remarks: 'User requested account deletion',
      Id: 0,
      UserCode: '',
      FirstName: '',
      LastName: '',
      RoleId: 0,
      GenderId: 0,
      Password: '',
      CreatedAt: new Date(),
      RowVer: 1
    };

    const res = await new Promise((resolve) => {
      fetchData(
        `/BlazorApi/deletaccount`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        },
        (res) => resolve(res)
      );
    });

    setLoading(false);

    if (res?.status) {
      showToast(res?.message || 'Code sent successfully', 'success');
      setCodeInputEnabled(true);      // enable verification code input
      setTimer(120);                  // 2-minute countdown
    } else {
      showToast(res?.message || res?.errorCode, 'error');
    }
  };

  const handleSubmit = async () => {
    if (!email || !verificationCode) {
      showToast('Email & verification code required', 'warning');
      return;
    }

    if (!isTermsAccepted) {
      showToast('Please accept Terms & Conditions', 'warning');
      return;
    }

    setLoading(true);

    const body = {
      Email: email,
      SecurityToken: verificationCode,
      Status: 4, // DELETED
      Remarks: 'User requested account deletion',
      Id: 0,
      UserCode: '',
      FirstName: '',
      LastName: '',
      RoleId: 0,
      GenderId: 0,
      Password: '',
      CreatedAt: new Date(),
      RowVer: 1
    };

    const res = await new Promise((resolve) => {
      fetchData(
        `/BlazorApi/deletaccount`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        },
        (res) => resolve(res)
      );
    });

    setLoading(false);

    showToast(res?.message || res?.errorCode, res?.status ? 'success' : 'danger');

    if (res?.status) {
      toggle(); // close modal on success
    }
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className="Modal_Term_Condition" centered>
        <ModalHeader toggle={toggle}>Delete Account</ModalHeader>

        <ModalBody className="paddingAllSide">

          <div className="note-box mb-3">
            <strong>Note :</strong>
            <ul className="mb-0">
              <li>Enter your registered email and click Get Code</li>
              <li>You will receive a verification code via email</li>
              <li>Enter the code and submit to delete account</li>
              <li>Account data is recoverable within 7 days</li>
            </ul>
          </div>

          <CRow className="mb-3">
            <CCol xs={9}>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CCol>
            <CCol xs={3}>
              <button
                className="btn btn-primary w-100"
                onClick={handleGetCode}
                disabled={loading || timer > 0}
              >
                {timer > 0 ? `Resend in ${formatTime(timer)}` : 'Get Code'}

              </button>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs={12}>
              <input
                type="text"
                className="form-control"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={!codeInputEnabled}
              />
            </CCol>
          </CRow>

          <CFormCheck
            checked={isTermsAccepted}
            className="d-flex flex-row justify-content-center"
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
            label={
              <span>
                I agree to{' '}
                <strong className="lblTerms" onClick={TermsModal}>
                  Terms & Conditions (EULA)
                </strong>
              </span>
            }
          />

          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-secondary" onClick={toggle}>
              Cancel
            </button>
            <button className="btn btn-secondary"onClick={handleSubmit} disabled={loading || !verificationCode.trim()}>
              Submit
            </button>

            {/*<button className="btn btn-secondary" onClick={handleSubmit} disabled={loading}>*/}
            {/*  Submit*/}
            {/*</button>*/}
          </div>
        </ModalBody>
      </Modal>

      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </>
  );
};

export default Unsubscribe;
