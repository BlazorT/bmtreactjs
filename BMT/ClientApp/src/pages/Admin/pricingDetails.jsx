/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CRow, CCol } from '@coreui/react';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import AppContainer from 'src/components/UI/AppContainer';
import globalutil from 'src/util/globalutil';

const PricingDetails = () => {
  const user = useSelector((state) => state.user);

  // =======================
  // STATE
  // =======================
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [messages, setMessages] = useState('');
  const [duration, setDuration] = useState(1);
  const [pricingMatrix, setPricingMatrix] = useState([]);

  // =======================
  // HELPERS
  // =======================
  const getNetworkName = (networkId) => {
    const findNetwork = globalutil.networks()?.find(
      (n) => n.id == networkId
    );
    return findNetwork?.name || '';
  };

  // =======================
  // CALCULATION LOGIC
  // =======================
  useEffect(() => {
    if (!selectedNetwork || !messages || Number(messages) <= 0) {
      setPricingMatrix([]);
      return;
    }

    // Base price (example)
    const basePricePerMsg = 1;

    // Discounts
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
        pricePerMsg: pricePerMsg.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      },
    ]);
  }, [selectedNetwork, messages, duration]);

  // =======================
  // GRID COLUMNS (FIXED WIDTH)
  // =======================
  const columns = [
    { field: 'network', headerName: 'Network' },
    { field: 'messages', headerName: 'Messages' },
    { field: 'duration', headerName: 'Duration' },
    { field: 'pricePerMsg', headerName: 'Price / Msg' },
    { field: 'totalPrice', headerName: 'Total Price' },
  ];
  console.log('pricingMatrix:', pricingMatrix);

  // =======================
  // RENDER
  // =======================
  return (
    <AppContainer>
      <DataGridHeader title="Pricing Details" />

      {/* ================= FILTERS ================= */}
      <CRow className="mb-4">
        <CCol md={4}>
          <label className="mb-1">Network</label>
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
        </CCol>

        <CCol md={4}>
          <label className="mb-1">Number of Messages</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter messages"
            value={messages}
            onChange={(e) => setMessages(e.target.value)}
          />
        </CCol>

        <CCol md={4}>
          <label className="mb-1">Duration</label>
          <select
            className="form-select"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
          </select>
        </CCol>
      </CRow>

      {/* ================= PRICING MATRIX (ALWAYS MOUNTED) ================= */}

    
        <div className="row ">
          <div className="col-md-12 col-xl-12">
          <CustomDatagrid
            rows={pricingMatrix}
            columns={columns}
            hideFooter
          />
        </div>
        </div>
    

    </AppContainer>
  );
};

export default PricingDetails;
