/* eslint-disable react/react-in-jsx-scope */
import { CCol, CRow } from '@coreui/react';

const BlazorTabs = (prop) => {
  const { tabs, handleActiveTab, activeTab, disable } = prop;

  const handleTab = (i) => {
    handleActiveTab(i);
  };

  return (
    <CRow className="p-0">
      <CCol>
        <div className="dashboard-links">
          {tabs?.map((link, index) => (
            <div key={index}>
              <div
                onClick={() => (disable ? undefined : handleTab(link?.id || index))}
                disabled={disable}
                className={activeTab === link?.id ? 'dashboard-link-active' : 'dashboard-link'}
              >
                {link?.name}
              </div>
            </div>
          ))}
        </div>
      </CCol>
    </CRow>
  );
};

export default BlazorTabs;
