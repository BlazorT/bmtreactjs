/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import {
  CAlert,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react';
import { useEffect, useState } from 'react';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../UI/Button';
import { useEasyPaisa } from 'src/hooks/useEasyPaisa';
import { useLocation, useSearchParams } from 'react-router-dom';

const paymentGatewayDescriptions = {
  cash: 'Simply Pay at the restaurant, when you pick up the food.',
  'cash on delivery': 'Simply pay the driver, when he delivers the food to your doorstep.',
  jazzcash:
    'Either pay with your JazzCash card or your JazzCash wallet. You can add money to your JazzCash wallet from your bank account or credit card.',
  easypaisa:
    'You will be redirected to easypaisa after checkout. After you performed the payment, you will be redirected back to bmt.',
  default:
    'You will be redirected to the payment gateway after checkout. After you performed the payment, you will be redirected back to bmt.',
};

const PaymentModel = ({ isOpen, toggle, onSubmit, amount }) => {
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();

  const [loading, setLoading] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [paymentGateway, setPaymentGateway] = useState(null);
  const [jazzCashMode, setJazzCashMode] = useState(null); // 'wallet' or 'card'
  const [walletData, setWalletData] = useState({
    accountNumber: '',
    cnicLastSix: '',
  });
  const [errors, setErrors] = useState({});
  //!! amount
  const { prepareRequest } = useEasyPaisa(true, 1, paymentGateway, 'BMT');

  useEffect(() => {
    if (!isOpen) return;
    fetchGateways();
  }, [isOpen]);

  useEffect(() => {
    // Reset JazzCash mode when gateway changes
    if (selectedGateway) {
      const gateway = gateways.find((g) => g.id === selectedGateway);
      if (gateway?.name?.toLowerCase() !== 'jazzcash') {
        setJazzCashMode(null);
        setWalletData({ accountNumber: '', cnicLastSix: '' });
        setErrors({});
      }
    }
  }, [selectedGateway, gateways]);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      const body = {
        storeId: 1,
      };
      const res = await fetch('https://hotmealzndealz.com/api/blazorApi/paymentgateways', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: '!09876RoZaLb',
        },
      });
      if (!res.ok) {
        throw new Error(`Req failed with status : ${res?.status}`);
      }
      const response = await res.json();
      if (response?.data && Array.isArray(response?.data)) {
        setGateways(
          response.data?.filter(
            (g) => g?.name?.toLowerCase() === 'jazzcash' || g?.name?.toLowerCase() === 'easypaisa',
          ),
        );
      }
    } catch (error) {
      setGateways([]);
      showToast('Failed to load payment gateways', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGatewaySelect = (gatewayId) => {
    setSelectedGateway(gatewayId);
    const findGateway = gateways?.find((g) => g.id === gatewayId);
    console.log({ findGateway });
    if (findGateway) setPaymentGateway(findGateway);
  };

  const validateWalletInputs = () => {
    const newErrors = {};

    if (!walletData.accountNumber) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^03\d{9}$/.test(walletData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 11 digits starting with 03';
    }

    if (!walletData.cnicLastSix) {
      newErrors.cnicLastSix = 'Last 6 digits of CNIC are required';
    } else if (!/^\d{6}$/.test(walletData.cnicLastSix)) {
      newErrors.cnicLastSix = 'Must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setWalletData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const onYes = () => {
    showConfirmation({ isOpen: false });
    setSelectedGateway(null);
    setJazzCashMode(null);
    setWalletData({ accountNumber: '', cnicLastSix: '' });
    setErrors({});
    toggle();
  };

  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onYes(),
      onNo: () =>
        showConfirmation({
          isOpen: false,
        }),
    });
  };

  const handlePay = () => {
    if (!selectedGateway) {
      showToast('Please select a payment gateway', 'warning');
      return;
    }

    const gateway = gateways.find((g) => g.id === selectedGateway);
    if (gateway?.name?.toLowerCase() === 'jazzcash') {
      if (!jazzCashMode) {
        showToast('Please select a JazzCash payment mode', 'warning');
        return;
      }

      if (jazzCashMode === 'wallet' && !validateWalletInputs()) {
        return;
      }
    }

    // Handle payment logic here
    console.log('Selected gateway:', selectedGateway);
    console.log('JazzCash mode:', jazzCashMode);
    console.log('Wallet data:', walletData);
    if (gateway?.name?.toLowerCase() === 'easypaisa') {
      prepareRequest();
    }
  };

  const getGatewayDescription = (gatewayName) => {
    const name = gatewayName?.toLowerCase();
    return paymentGatewayDescriptions[name] || paymentGatewayDescriptions.default;
  };

  return (
    <CModal
      visible={isOpen}
      alignment="center"
      aria-labelledby="email-send"
      aria-describedby="email-send-full-view"
      backdrop="static"
      className="payment-modal"
      size="lg"
    >
      <CModalHeader closeButton={false}>
        <CModalTitle>Payment Options</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {loading ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <p className="mt-2">Loading payment gateways...</p>
          </div>
        ) : gateways?.length === 0 ? (
          <p className="text-center">No Payment Gateways Available</p>
        ) : (
          <CRow className="g-3">
            {gateways.map((gateway) => {
              const isJazzCash = gateway.name?.toLowerCase() === 'jazzcash';
              const isSelected = selectedGateway === gateway.id;

              return (
                <CCol xs={12} key={gateway.id || gateway.name}>
                  <div
                    className={`border rounded p-3 ${isSelected ? 'border-primary bg-light' : ''}`}
                    style={{ transition: 'all 0.2s' }}
                  >
                    <div
                      onClick={() => handleGatewaySelect(gateway.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CFormCheck
                        type="radio"
                        name="paymentGateway"
                        id={`gateway-${gateway.id}`}
                        checked={isSelected}
                        onChange={() => handleGatewaySelect(gateway.id)}
                        label={
                          <div className="d-flex align-items-start gap-3">
                            {gateway.logo && (
                              <img
                                src={`data:image/png;base64,${gateway.logo}`}
                                alt={gateway.name}
                                style={{
                                  width: '60px',
                                  height: '30px',
                                  objectFit: 'contain',
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="fw-semibold">{gateway.name}</span>
                          </div>
                        }
                      />
                    </div>

                    {isSelected && (
                      <div className="mt-1 ps-0">
                        <CAlert color="info" className="mb-0">
                          <small>{getGatewayDescription(gateway.name)}</small>
                        </CAlert>

                        {isJazzCash && (
                          <div className="mt-3">
                            <p className="fw-semibold mb-2">Select Payment Mode:</p>
                            <div className="d-flex flex-column gap-2">
                              <div className="d-flex w-100">
                                <CFormCheck
                                  type="radio"
                                  name="jazzCashMode"
                                  id="jazzcash-wallet"
                                  value="wallet"
                                  checked={jazzCashMode === 'wallet'}
                                  onChange={() => setJazzCashMode('wallet')}
                                  label="Pay From Mobile Wallet"
                                  className="flex-grow-1"
                                />
                              </div>
                              <div className="d-flex w-100">
                                <CFormCheck
                                  type="radio"
                                  name="jazzCashMode"
                                  id="jazzcash-card"
                                  value="card"
                                  checked={jazzCashMode === 'card'}
                                  onChange={() => setJazzCashMode('card')}
                                  label="Pay Through Card"
                                  className="flex-grow-1"
                                />
                              </div>
                            </div>

                            {jazzCashMode === 'wallet' && (
                              <div className="mt-3 p-3 border rounded bg-primary">
                                <CRow className="g-3">
                                  <CCol xs={12}>
                                    <CFormLabel htmlFor="accountNumber">
                                      Account Number <span className="text-danger">*</span>
                                    </CFormLabel>
                                    <CFormInput
                                      type="text"
                                      id="accountNumber"
                                      placeholder="03XXXXXXXXX"
                                      value={walletData.accountNumber}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 11) {
                                          handleInputChange('accountNumber', value);
                                        }
                                      }}
                                      invalid={!!errors.accountNumber}
                                      maxLength={11}
                                    />
                                    {errors.accountNumber && (
                                      <div className="text-danger small mt-1">
                                        {errors.accountNumber}
                                      </div>
                                    )}
                                    <small>11 digits starting with 03</small>
                                  </CCol>

                                  <CCol xs={12}>
                                    <CFormLabel htmlFor="cnicLastSix">
                                      Last 6 Digits of CNIC <span className="text-danger">*</span>
                                    </CFormLabel>
                                    <CFormInput
                                      type="text"
                                      id="cnicLastSix"
                                      placeholder="XXXXXX"
                                      value={walletData.cnicLastSix}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 6) {
                                          handleInputChange('cnicLastSix', value);
                                        }
                                      }}
                                      invalid={!!errors.cnicLastSix}
                                      maxLength={6}
                                    />
                                    {errors.cnicLastSix && (
                                      <div className="text-danger small mt-1">
                                        {errors.cnicLastSix}
                                      </div>
                                    )}
                                    <small>Enter the last 6 digits of your CNIC</small>
                                  </CCol>
                                </CRow>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CCol>
              );
            })}
          </CRow>
        )}
      </CModalBody>

      <CModalFooter>
        <Button title="Cancel" onClick={confirmationModal} disabled={loading} />
        <Button
          title="Pay"
          onClick={handlePay}
          type="submit"
          loading={loading}
          disabled={!selectedGateway}
        />
      </CModalFooter>
    </CModal>
  );
};

export default PaymentModel;
