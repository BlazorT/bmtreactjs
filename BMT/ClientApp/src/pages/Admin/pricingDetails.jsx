/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CCollapse,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CRow,
} from '@coreui/react';
import { useEffect, useState } from 'react';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import AppContainer from 'src/components/UI/AppContainer';
import globalutil from 'src/util/globalutil';

const PricingDetails = () => {
  // =======================
  // STATE
  // =======================
  const [pricingMode, setPricingMode] = useState('individual');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [messages, setMessages] = useState('');
  const [waConversations, setWaConversations] = useState('');
  const [duration, setDuration] = useState(1);
  const [includeSMS, setIncludeSMS] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includeWhatsApp, setIncludeWhatsApp] = useState(true);
  const [pricingMatrix, setPricingMatrix] = useState([]);
  const [smsOpen, setSmsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(true);
  const [fbOpen, setFbOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [instagramOpen, setInstagramOpen] = useState(false);
  const [tiktokOpen, setTiktokOpen] = useState(false);
  const [linkedinOpen, setLinkedinOpen] = useState(false);
  // Collapse state: true = expanded (open), false = collapsed
  const [collapseOpen, setCollapseOpen] = useState(false); // start expanded

  // =======================
  // HELPERS
  // =======================
  const getNetworkName = (networkId) => {
    const findNetwork = globalutil.networks()?.find((n) => n.id == networkId);
    return findNetwork?.name || '';
  };

  // =======================
  // CALCULATION LOGIC
  // =======================
  useEffect(() => {
    if (pricingMode === 'individual') {
      if (!selectedNetwork || !messages || Number(messages) <= 0) {
        setPricingMatrix([]);
        return;
      }

      const basePricePerMsg = 1; // Adjust as needed
      let discount = 1;
      if (duration === 3) discount = 0.9;
      if (duration === 6) discount = 0.8;

      const pricePerMsg = basePricePerMsg * discount;
      const totalPrice = Number(messages) * pricePerMsg;

      setPricingMatrix([
        {
          id: 1,
          network: getNetworkName(selectedNetwork),
          messages: Number(messages),
          duration: `${duration} Month(s)`,
          pricePerMsg: `$${pricePerMsg.toFixed(2)}`,
          totalPrice: `$${totalPrice.toFixed(2)}`,
          type: 'Individual Messaging',
        },
      ]);
    } else {
      if (!waConversations || Number(waConversations) <= 0) {
        setPricingMatrix([]);
        return;
      }

      let bundlePrice = 79;
      let includedItems = ['WhatsApp Business API Included'];

      if (Number(waConversations) <= 500) {
        includedItems.push('500 WhatsApp Conversations');
      } else if (Number(waConversations) <= 2000) {
        bundlePrice = 149;
        includedItems.push('2,000 WhatsApp Conversations', '10,000 Emails');
        if (includeSMS) includedItems.push('2,000 SMS');
      } else {
        bundlePrice = 299;
        includedItems.push('Unlimited WhatsApp (fair use)', '50,000 Emails', '10,000 SMS');
      }

      if (includeSMS && Number(waConversations) <= 500) {
        bundlePrice += 20;
        includedItems.push('SMS Included');
      }
      if (includeEmail && Number(waConversations) <= 500) {
        bundlePrice += 15;
        includedItems.push('Email Included');
      }

      let discount = 1;
      if (duration === 3) discount = 0.9;
      if (duration === 6) discount = 0.8;
      const finalPrice = bundlePrice * discount;

      setPricingMatrix([
        {
          id: 1,
          bundle: 'All-in-One Messaging Bundle',
          waConversations: Number(waConversations),
          included: includedItems.join(' | '),
          duration: `${duration} Month(s)`,
          totalPrice: `$${finalPrice.toFixed(2)}`,
          type: 'Combo Package',
        },
      ]);
    }
  }, [
    pricingMode,
    selectedNetwork,
    messages,
    waConversations,
    duration,
    includeSMS,
    includeEmail,
    includeWhatsApp,
  ]);

  // =======================
  // GRID COLUMNS
  // =======================
  const individualColumns = [
    { key: 'network', name: 'Network' },
    { key: 'messages', name: 'Messages' },
    { key: 'duration', name: 'Duration' },
    { key: 'pricePerMsg', name: 'Price / Msg' },
    { key: 'totalPrice', name: 'Total Price' },
    { key: 'type', name: 'Type' },
  ];

  const comboColumns = [
    { key: 'bundle', name: 'Bundle' },
    { key: 'waConversations', name: 'WA Conversations' },
    { key: 'included', name: 'Included Features' },
    { key: 'duration', name: 'Duration' },
    { key: 'totalPrice', name: 'Total Price' },
    { key: 'type', name: 'Type' },
  ];

  const columns = pricingMode === 'individual' ? individualColumns : comboColumns;

  // =======================
  // RENDER
  // =======================
  return (
    <AppContainer>
      <CRow className="justify-content-center mb-4">
        <CCol xs="auto">
          <h2>Pricing Details</h2>
        </CCol>
      </CRow>
      {/* 2. Email Marketing Pricing */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setEmailOpen(!emailOpen)}
        >
          <span className="fs-4">Email Marketing Plans</span>
          <span className="fs-3">{emailOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={emailOpen}>
          <CCardBody>
            <CRow className="g-4">
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Free</h5>
                    <div className="my-4">
                      <span className="fs-1 fw-bold">$0</span>
                      <span className="text-muted"> / One Time</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Start Free
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ 10 emails/One Time</CListGroupItem>
                      <CListGroupItem>✓ Basic templates</CListGroupItem>
                      <CListGroupItem>✓ Analytics</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 10%
                  </CBadge>
                  <h5 className="mt-5">Starter</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$10</span>
                    <span className="text-muted"> / 1 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 5,000 emails/ 1 month</CListGroupItem>
                    <CListGroupItem>✓ Custom templates</CListGroupItem>
                    <CListGroupItem>✓ Advanced analytics</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 15%
                  </CBadge>
                  <h5 className="mt-5">Premium</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$15</span>
                    <span className="text-muted"> / 6 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 10,000 emails/ 6 month</CListGroupItem>
                    <CListGroupItem>✓ Custom templates</CListGroupItem>
                    <CListGroupItem>✓ Advanced analytics</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 20%
                  </CBadge>
                  <h5 className="mt-5">Business</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$49</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 50,000 emails/Yearly</CListGroupItem>
                    <CListGroupItem>✓ Automation workflows</CListGroupItem>
                    <CListGroupItem>✓ Priority support</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>
      {/* 1. SMS Pricing */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setSmsOpen(!smsOpen)}
        >
          <span className="fs-4">SMS Marketing Plans</span>
          <span className="fs-3">{smsOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={smsOpen}>
          <CCardBody>
            <CRow className="g-4">
              {/* Pay-as-you-go */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Pay As You Go</h5>
                    <div className="">
                      <span className="fs-1 fw-bold">$0.02</span>
                      <span className="text-muted"> / SMS</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Get Started
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ No monthly commitment</CListGroupItem>
                      <CListGroupItem>✓ Instant delivery</CListGroupItem>
                      <CListGroupItem>✓ Pay only for what you send</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* 5,000 SMS */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <CBadge
                      color="warning"
                      className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                    >
                      SAVE 10%
                    </CBadge>
                    <h5 className="mt-5">Bulk 5K</h5>
                    <div className="my-4">
                      <span className="text-muted text-decoration-line-through me-2">$100</span>
                      <span className="fs-1 fw-bold">$75</span>
                      <span className="text-muted"> / Monthly</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Buy Now
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ 5,000 SMS credits</CListGroupItem>
                      <CListGroupItem>✓ Valid for 12 months</CListGroupItem>
                      <CListGroupItem>✓ Best for small campaigns</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* 10,000 SMS */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 15%
                  </CBadge>
                  <h5 className="mt-5">Bulk 10K</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$200</span>
                    <span className="fs-1 fw-bold">$140</span>
                    <span className="text-muted"> / 6 Month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 10,000 SMS credits</CListGroupItem>
                    <CListGroupItem>✓ Valid for 6 months</CListGroupItem>
                    <CListGroupItem>✓ Ideal for growing businesses</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              {/* Monthly Plan */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 20%
                  </CBadge>
                  <h5 className="mt-5">Yearly</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$50</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Subscribe
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 3,000 SMS / Yearly</CListGroupItem>
                    <CListGroupItem>✓ Auto-renew</CListGroupItem>
                    <CListGroupItem>✓ Cancel anytime</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>

      {/* 2. FaceBook Marketing Pricing */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setFbOpen(!fbOpen)}
        >
          <span className="fs-4">Facebook Marketing Plans</span>
          <span className="fs-3">{fbOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={fbOpen}>
          <CCardBody>
            <CRow className="g-4">
              {/* Free Plan */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Free</h5>
                    <div className="my-4">
                      <span className="fs-1 fw-bold">$5</span>
                      <span className="text-muted"> / 1 Month</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Start Free
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ Organic posts & reels</CListGroupItem>
                      <CListGroupItem>✓ Page management</CListGroupItem>
                      <CListGroupItem>✓ Basic insights</CListGroupItem>
                      <CListGroupItem>✓ No ads</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Starter Plan */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 10%
                  </CBadge>
                  <h5 className="mt-5">Starter</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$29</span>
                    <span className="text-muted"> / 3 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 20 boosted posts/month</CListGroupItem>
                    <CListGroupItem>✓ 5 reel promotions</CListGroupItem>
                    <CListGroupItem>✓ Basic ad manager access</CListGroupItem>
                    <CListGroupItem>✓ Audience targeting</CListGroupItem>
                    <CListGroupItem>✓ Monthly performance report</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              {/* Premium Plan */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 20%
                  </CBadge>
                  <h5 className="mt-5">Premium</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$79</span>
                    <span className="text-muted"> / 6 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Unlimited boosted posts & reels</CListGroupItem>
                    <CListGroupItem>✓ 10 full ad campaigns/month</CListGroupItem>
                    <CListGroupItem>✓ A/B testing</CListGroupItem>
                    <CListGroupItem>✓ Custom audiences & lookalikes</CListGroupItem>
                    <CListGroupItem>✓ Weekly analytics report</CListGroupItem>
                    <CListGroupItem>✓ Priority support</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              {/* Business Plan */}
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    BEST VALUE
                  </CBadge>
                  <h5 className="mt-5">Business</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$199</span>
                    <span className="fs-1 fw-bold">$149</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Everything in Premium</CListGroupItem>
                    <CListGroupItem>✓ Unlimited ad campaigns</CListGroupItem>
                    <CListGroupItem>✓ Pixel & conversion tracking</CListGroupItem>
                    <CListGroupItem>✓ Retargeting ads</CListGroupItem>
                    <CListGroupItem>✓ Dedicated account manager</CListGroupItem>
                    <CListGroupItem>✓ Daily performance insights</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>
      {/* Instagram Marketing Plans */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setInstagramOpen(!instagramOpen)}
        >
          <span className="fs-4">Instagram Marketing Plans</span>
          <span className="fs-3">{instagramOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={instagramOpen}>
          <CCardBody>
            <CRow className="g-4">
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Basic</h5>
                    <div className="my-4">
                      <span className="fs-1 fw-bold">$7</span>
                      <span className="text-muted"> / month</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Buy Now
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ Organic posts & stories</CListGroupItem>
                      <CListGroupItem>✓ Profile management</CListGroupItem>
                      <CListGroupItem>✓ Basic insights</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 15%
                  </CBadge>
                  <h5 className="mt-5">Growth</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$49</span>
                    <span className="text-muted"> / 3 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 30 boosted posts/ 3 month</CListGroupItem>
                    <CListGroupItem>✓ Reel promotions</CListGroupItem>
                    <CListGroupItem>✓ Hashtag & audience targeting</CListGroupItem>
                    <CListGroupItem>✓ Monthly report</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    POPULAR
                  </CBadge>
                  <h5 className="mt-5">Premium</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$149</span>
                    <span className="fs-1 fw-bold">$119</span>
                    <span className="text-muted"> / 6 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Unlimited boosts & ads</CListGroupItem>
                    <CListGroupItem>✓ Stories & carousel ads</CListGroupItem>
                    <CListGroupItem>✓ A/B testing</CListGroupItem>
                    <CListGroupItem>✓ Shop integration</CListGroupItem>
                    <CListGroupItem>✓ Weekly analytics</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    POPULAR
                  </CBadge>
                  <h5 className="mt-5">Pro</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$149</span>
                    <span className="fs-1 fw-bold">$150</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Unlimited boosts & ads</CListGroupItem>
                    <CListGroupItem>✓ Stories & carousel ads</CListGroupItem>
                    <CListGroupItem>✓ A/B testing</CListGroupItem>
                    <CListGroupItem>✓ Shop integration</CListGroupItem>
                    <CListGroupItem>✓ Weekly analytics</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>

      {/* TikTok Marketing Plans */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setTiktokOpen(!tiktokOpen)}
        >
          <span className="fs-4">TikTok Marketing Plans</span>
          <span className="fs-3">{tiktokOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={tiktokOpen}>
          <CCardBody>
            <CRow className="g-4">
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Starter</h5>
                    <div className="my-4">
                      <span className="fs-1 fw-bold">$7</span>
                      <span className="text-muted"> / 1 month</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Buy Now
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ Organic video posting</CListGroupItem>
                      <CListGroupItem>✓ Trend access</CListGroupItem>
                      <CListGroupItem>✓ Basic effects</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 20%
                  </CBadge>
                  <h5 className="mt-5">Creator</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$69</span>
                    <span className="text-muted"> / 3 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 20 promoted videos/month</CListGroupItem>
                    <CListGroupItem>✓ Spark Ads</CListGroupItem>
                    <CListGroupItem>✓ Trend boosting</CListGroupItem>
                    <CListGroupItem>✓ Duet & Stitch promotion</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    BEST VALUE
                  </CBadge>
                  <h5 className="mt-5">Viral Pro</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$199</span>
                    <span className="fs-1 fw-bold">$159</span>
                    <span className="text-muted"> / 6 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Unlimited promotions</CListGroupItem>
                    <CListGroupItem>✓ In-feed & TopView ads</CListGroupItem>
                    <CListGroupItem>✓ Branded effects</CListGroupItem>
                    <CListGroupItem>✓ Live stream boosting</CListGroupItem>
                    <CListGroupItem>✓ Detailed analytics</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    BEST VALUE
                  </CBadge>
                  <h5 className="mt-5">Viral Premium</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$199</span>
                    <span className="fs-1 fw-bold">$159</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Unlimited promotions</CListGroupItem>
                    <CListGroupItem>✓ In-feed & TopView ads</CListGroupItem>
                    <CListGroupItem>✓ Branded effects</CListGroupItem>
                    <CListGroupItem>✓ Live stream boosting</CListGroupItem>
                    <CListGroupItem>✓ Detailed analytics</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>

      {/* LinkedIn Marketing Plans */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setLinkedinOpen(!linkedinOpen)}
        >
          <span className="fs-4">LinkedIn Marketing Plans</span>
          <span className="fs-3">{linkedinOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={linkedinOpen}>
          <CCardBody>
            <CRow className="g-4">
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Free</h5>
                    <div className="my-4">
                      <span className="fs-1 fw-bold">$6</span>
                      <span className="text-muted"> / 1 month</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Buy Now
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ Company page posts</CListGroupItem>
                      <CListGroupItem>✓ Organic reach</CListGroupItem>
                      <CListGroupItem>✓ Basic analytics</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 10%
                  </CBadge>
                  <h5 className="mt-5">Professional</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$99</span>
                    <span className="text-muted"> / 6 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 15 sponsored posts/ 6 month</CListGroupItem>
                    <CListGroupItem>✓ Lead gen forms</CListGroupItem>
                    <CListGroupItem>✓ Job title & industry targeting</CListGroupItem>
                    <CListGroupItem>✓ Monthly report</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 25%
                  </CBadge>
                  <h5 className="mt-5">Business</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$299</span>
                    <span className="fs-1 fw-bold">$224</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Unlimited sponsored content</CListGroupItem>
                    <CListGroupItem>✓ Carousel & video ads</CListGroupItem>
                    <CListGroupItem>✓ Company & skill targeting</CListGroupItem>
                    <CListGroupItem>✓ InMail credits</CListGroupItem>
                    <CListGroupItem>✓ Weekly insights</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <h5 className="mt-3">Enterprise</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">Custom</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Contact Sales
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Full campaign management</CListGroupItem>
                    <CListGroupItem>✓ Account-based marketing</CListGroupItem>
                    <CListGroupItem>✓ Dedicated strategist</CListGroupItem>
                    <CListGroupItem>✓ API access</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>
      {/* 3. WhatsApp Messaging Pricing */}
      <CCard className="mb-4 shadow-sm border-0">
        <CButton
          color="link"
          className="d-flex justify-content-between align-items-center w-100 p-4 text-start fw-bold text-primary"
          onClick={() => setWhatsappOpen(!whatsappOpen)}
        >
          <span className="fs-4">WhatsApp Business Plans</span>
          <span className="fs-3">{whatsappOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={whatsappOpen}>
          <CCardBody>
            <CRow className="g-4">
              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <h5 className="mt-3">Per Conversation</h5>
                    <div className="my-4">
                      <span className="fs-1 fw-bold">$0.05</span>
                      <span className="text-muted"> / conversation</span>
                    </div>
                    <CButton color="dark" className="mb-4">
                      Get Started
                    </CButton>
                    <CListGroup flush className="text-start mt-auto">
                      <CListGroupItem>✓ Pay only for initiated chats</CListGroupItem>
                      <CListGroupItem>✓ Official WhatsApp API</CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm position-relative">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 10%
                  </CBadge>
                  <h5 className="mt-5">Bundle 1K</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$45</span>
                    <span className="text-muted"> / month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Subscribe
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 1,000 conversations</CListGroupItem>
                    <CListGroupItem>✓ Template messages</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-2"
                  >
                    SAVE 15%
                  </CBadge>
                  <h5 className="mt-5">Bundle 5K</h5>
                  <div className="my-4">
                    <span className="text-muted text-decoration-line-through me-2">$250</span>
                    <span className="fs-1 fw-bold">$200</span>
                    <span className="text-muted"> / 6 month</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Subscribe
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ 5,000 conversations</CListGroupItem>
                    <CListGroupItem>✓ Higher limits</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>

              <CCol md={6} lg={3}>
                <CCard className="h-100 text-center border-none shadow-sm">
                  <h5 className="mt-3">Automation</h5>
                  <div className="my-4">
                    <span className="fs-1 fw-bold">$99</span>
                    <span className="text-muted"> / Yearly</span>
                  </div>
                  <CButton color="dark" className="mb-4">
                    Buy Now
                  </CButton>
                  <CListGroup flush className="text-start mt-auto">
                    <CListGroupItem>✓ Chatbot included</CListGroupItem>
                    <CListGroupItem>✓ 2,000 conversations</CListGroupItem>
                    <CListGroupItem>✓ Flow builder</CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>
      {/* Collapsible Pricing Calculator Card */}
      <CCard className="shadow-sm">
        <CButton
          color="primary"
          variant="outline"
          className="d-flex justify-content-between align-items-center w-100 p-3 text-start fw-bold rounded-0"
          onClick={() => setCollapseOpen(!collapseOpen)}
        >
          <span className="fs-4">Pricing Calculator</span>
          <span className="fs-4">{collapseOpen ? '▼' : '▶'}</span>
        </CButton>

        <CCollapse visible={collapseOpen}>
          <CCardBody className="pt-4">
            {/* Pricing Mode Selector */}
            <CRow className="mb-4">
              <CCol md={12}>
                <label className="fw-bold mb-2">Pricing Mode</label>
                <div className="d-flex gap-4">
                  <CFormCheck
                    type="radio"
                    name="pricingMode"
                    id="individualMode"
                    label="Individual Messaging (e.g., SMS/Voice per message)"
                    checked={pricingMode === 'individual'}
                    onChange={() => setPricingMode('individual')}
                  />
                  <CFormCheck
                    type="radio"
                    name="pricingMode"
                    id="comboMode"
                    label="Combo / All-in-One Bundle (SMS + Email + WhatsApp)"
                    checked={pricingMode === 'combo'}
                    onChange={() => setPricingMode('combo')}
                  />
                </div>
              </CCol>
            </CRow>

            {/* Two-Column Layout (Inputs + Summary) */}
            <CRow>
              {/* Left Column: Inputs */}
              <CCol md={4} lg={3}>
                <div className="mb-4">
                  <label className="fw-bold mb-1">Duration</label>
                  <select
                    className="form-select"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months (10% off)</option>
                    <option value={6}>6 Months (20% off)</option>
                  </select>
                </div>

                {pricingMode === 'individual' ? (
                  <>
                    <div className="mb-4">
                      <label className="fw-bold mb-1">Network</label>
                      <select
                        className="form-select"
                        value={selectedNetwork}
                        onChange={(e) => setSelectedNetwork(e.target.value)}
                      >
                        <option value="">Select Network</option>
                        {globalutil.networks()?.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="fw-bold mb-1">Number of Messages</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g., 5000"
                        value={messages}
                        onChange={(e) => setMessages(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="fw-bold mb-1">Combo (All in One) / Month</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g., 1000"
                        value={waConversations}
                        onChange={(e) => setWaConversations(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="fw-bold mb-2">Include Channels in Bundle</label>
                      <div className="d-flex flex-wrap align-items-center gap-4">
                        <CFormCheck
                          type="checkbox"
                          id="includeSMS"
                          label="SMS"
                          checked={includeSMS}
                          onChange={(e) => setIncludeSMS(e.target.checked)}
                          inline
                        />
                        <CFormCheck
                          type="checkbox"
                          id="includeEmail"
                          label="Email"
                          checked={includeEmail}
                          onChange={(e) => setIncludeEmail(e.target.checked)}
                          inline
                        />
                        <CFormCheck
                          type="checkbox"
                          id="includeWhatsApp"
                          label="WhatsApp"
                          checked={includeWhatsApp}
                          onChange={(e) => setIncludeWhatsApp(e.target.checked)}
                          inline
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}
              </CCol>

              {/* Right Column: Live Pricing Summary */}
              <CCol md={8} lg={9}>
                <CCard className="h-100 shadow-sm border-0">
                  <CCardBody className="gridBgColor">
                    <CCardTitle className="fw-bold text-primary mb-3">
                      {pricingMode === 'individual' ? 'Pricing Summary' : 'Bundle Summary'}
                    </CCardTitle>
                    {pricingMatrix.length > 0 ? (
                      <CustomDatagrid
                        rows={pricingMatrix}
                        columns={columns}
                        hideFooter={false}
                        pageSize={5}
                      />
                    ) : (
                      <p className="text-muted mt-4">
                        Enter details on the left to see the pricing summary.
                      </p>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
      </CCard>
    </AppContainer>
  );
};

export default PricingDetails;
