/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { cilClock } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CSpinner } from '@coreui/react';
import { useCallback, useEffect, useState } from 'react';
import useApi from 'src/hooks/useApi';
import useCountdownTimer from 'src/hooks/useCountdownTimer';
import { SOCKET_URL } from 'src/hooks/useJazzCash';
import { useShowToast } from 'src/hooks/useShowToast';

export default function JazzCashConfirm({
  isVisible,
  placeOrder,
  jazzCashTxnRef,
  jazzCashResponse,
}) {
  const showToast = useShowToast();
  const [isShow, setIsShow] = useState(false);
  const time = useCountdownTimer(10 * 60, isShow);
  const { postData: inquiry } = useApi(SOCKET_URL + '/api/payment/jc-inquire');

  useEffect(() => {
    if (isVisible) {
      setIsShow(true);
    }
  }, [isVisible]);

  const handleInquiry = useCallback(async () => {
    if (!jazzCashTxnRef) return;

    const response = await inquiry({ txnRefNo: jazzCashTxnRef });
    if (response?.pp_PaymentResponseCode === '121') {
      showToast('JazzCash payment successful', 'success');
      placeOrder(jazzCashResponse);
    }
    if (response?.pp_PaymentResponseCode === '999') {
      showToast(response?.pp_PaymentResponseMessage);

      setIsShow(false);
    }
  }, [jazzCashTxnRef, jazzCashResponse]);

  useEffect(() => {
    if (!isShow) return;

    const timeout = setInterval(() => {
      handleInquiry();
    }, 60 * 1000);

    return () => clearTimeout(timeout);
  }, [handleInquiry, isShow]);

  if (!isVisible) return null;

  return (
    <CModal visible={isShow} alignment="center" backdrop="static">
      <CModalHeader className="justify-content-center">
        <CModalTitle>Awaiting JazzCash Payment</CModalTitle>
      </CModalHeader>

      <CModalBody className="text-center d-flex flex-column align-items-center">
        <CSpinner color="primary" className="mb-3" />
        <p className=" small mb-2" style={{ maxWidth: '350px' }}>
          Your payment request has been sent to the JazzCash app. Please open the app and approve
          the transaction to complete your order.
        </p>

        <p className="small mb-2">
          <strong>Time remaining:</strong> {time}
        </p>

        <p className=" small d-flex align-items-center justify-content-center">
          <CIcon icon={cilClock} className="me-1" />
          If the payment isn&apos;t confirmed within 10 minutes, the request will be canceled
          automatically.
        </p>
      </CModalBody>
    </CModal>
  );
}
