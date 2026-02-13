/* eslint-disable react/react-in-jsx-scope */
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { useState } from 'react';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const LineCharCard = () => {
  const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];
  const [hiddenLines, setHiddenLines] = useState([]);

  const handleLegendClick = (entry) => {
    const { dataKey } = entry;

    if (hiddenLines.includes(dataKey)) {
      setHiddenLines(hiddenLines.filter((line) => line !== dataKey));
    } else {
      setHiddenLines([...hiddenLines, dataKey]);
    }
  };
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow className="mt-2 pb-2">
          <CCol className="mb-3 basic-drop-shadow" md={12}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <Legend wrapperStyle={{ color: '#ffffff' }} onClick={handleLegendClick} />
                <XAxis dataKey="name" tick={{ fill: '#ffffff' }} />
                <YAxis tick={{ fill: '#ffffff' }} />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#8884d8"
                  dot={{ fill: '#ffffff' }}
                  name="Notifications"
                  hide={hiddenLines.includes('uv')}
                />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#82ca9d"
                  dot={{ fill: '#ffffff' }}
                  name="Funds"
                  hide={hiddenLines.includes('pv')}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d3d6f',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default LineCharCard;
