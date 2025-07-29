// <reference path="../../components/component/downloadcontactstemplate .js" />
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sms from '@mui/icons-material/Sms';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import DownloadContactsTemplate from 'src/components/InputsComponent/DownloadContactsTemplate ';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import {getCampaignAddConfig,getInitialCampaignData,} from 'src/configs/InputConfig/campaignAddConfig';
import { CContainer } from '@coreui/react';
import globalutil from 'src/util/globalutil';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import Form from 'src/components/UI/Form';
import Loading from 'src/components/UI/Loading';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useDispatch, useSelector } from 'react-redux';
import { useShowToast } from 'src/hooks/useShowToast';

const campaignContacts = () => {
  // let state;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  

  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
 
  const allNetworkNames = globalutil.networks().map(n => n.name);

  const [selectedNetworks, setSelectedNetworks] = useState(allNetworkNames??[]);
  const [importedData, setImportedData] = useState({}); // { Twitter: ['abc', 'xyz'], ... }
  const [selectedFiles, setSelectedFiles] = useState({}); // { Twitter: File }
  const [cityData, setCityData] = useState([]); // Your table data
  const showToast = useShowToast();
 
  const handleCampaignAddContacts = (e, networkId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.split('.').pop();
    const allowedExtensions = ['csv', 'xls', 'xlsx'];

    const isValidType = allowedTypes.includes(file.type);
    const isValidExt = allowedExtensions.includes(fileExt);

    if (!isValidType || !isValidExt) {
      e.target.value = null;
      showToast('Only CSV or Excel (.csv, .xls, .xlsx) files are allowed.', 'error');
      return;
    }

    showToast(`File "${file.name}" selected successfully.`, 'success');

    setSelectedFiles(prev => ({
      ...prev,
      [networkId]: file
    }));
  };
  

  
  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };
  const confirmationModal = () => {

    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    setConfirmationModalOpen(false); // close the modal
    navigate('/Dashboard');
  };
  const icons = {
    Tiktock: Email,
    Snapchat: Email,
    Facebook: Facebook,
    Sms: Sms,
    Linkedin: LinkedIn,
    Twitter: Twitter,
    Instagram: Instagram,
    Whatsapp: WhatsApp, // Assuming WhatsApp is your component for WhatsApp icon
    Email: Email // Assuming Email is your component for Email icon
  };

 
  if (isLoading) {
    return <Loading />;
  }
 
  const [recipientInput, setRecipientInput] = useState({});  // current input text
  const [recipientsList, setRecipientsList] = useState({});  // network-wise array

  const handleCheckboxChange = (network) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter(n => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
    }
  };

  const handleInputChange = (network, value) => {
    setRecipientInput(prev => ({ ...prev, [network]: value }));
  };
  const validateRecipient = (network, value) => {
    if (!value) return false;

    const onlyDigits = /^\d+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idPattern = /^[a-zA-Z0-9_]+$/;

    const lowerNetwork = network.toLowerCase();

    if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
      return onlyDigits.test(value) && value.length >= 7;
    }

    if (lowerNetwork === 'email') {
      return emailPattern.test(value);
    }

    return idPattern.test(value);
  };

  const handleKeyDown = (e, network) => {
    const value = recipientInput[network]?.trim();
    if (e.key === 'Enter' && value) {
      e.preventDefault();

      const lowerNetwork = network.toLowerCase();
      const currentList = recipientsList[network] || [];

      if (!validateRecipient(network, value)) {
        let label = 'ID';
        if (lowerNetwork === 'email') label = 'email address';
        else if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') label = 'contact number (min 7 digits)';

        showToast(`Invalid ${network} format. Please enter a valid ${label}.`, 'error');
        return;
      }

      // ❌ Block duplicate in same network only
      if (currentList.includes(value)) {
        showToast(`${value} is already added to ${network}.`, 'error');
        return;
      }

      // ✅ Add value to current network
      setRecipientsList(prev => ({
        ...prev,
        [network]: [...currentList, value]
      }));

      // Clear input field
      setRecipientInput(prev => ({
        ...prev,
        [network]: ''
      }));
    }
  };


  const handleDeleteRecipient = (network, index) => {
    const updated = [...recipientsList[network]];
    updated.splice(index, 1);

    setRecipientsList(prev => ({ ...prev, [network]: updated }));

    // 👇 Hide dropdown if last item removed
    if (updated.length === 0) {
      const dropdown = document.getElementById(`recipients-${network}`);
      if (dropdown) dropdown.style.display = 'none';
    }
  };
  const handleImportClick = async (networkKey, networkId) => {
    const selectedFile = selectedFiles[networkId];
    const selectedNetworkId =networkId;
    console.log('Selected Network ID:', networkId);
    console.log('Selected File:', selectedFile);

    if (!selectedFile) {
      showToast('Please select a file first.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append("files", selectedFile);          // actual File object
    formData.append("netowrkid", selectedNetworkId); // keep key same as in C#


    try {
      const response = await fetch('/Compaigns/ImportFile', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      console.log('Server Response:', result);

      if (result.status === true && result.data) {
        setImportedData(prev => ({
          ...prev,
          [networkKey]: result.data
        }));
        showToast('Contacts imported successfully.', 'success');
      } else {
        showToast(result.message || 'Import failed.', 'error');
      }
    } catch (err) {
      console.error('Import error', err);
      showToast('Error during import.', 'error');
    }
  };
  return (
    <Form name="dsp-reg-form">
    
      <CContainer fluid className="mt-4">
        <DownloadContactsTemplate />

          <React.Fragment>
            <AppContainer>
              <DataGridHeader
                title="Networks"
                filterDisable={false}
              />
            </AppContainer>
          {globalutil.networks().map((network, index) => {
            const networkKey = network.name;
            const networkId = network.id;
            const IconName = networkKey.charAt(0).toUpperCase() + networkKey.slice(1).toLowerCase();
            const IconComponent = icons[IconName];
            const isChecked = selectedNetworks.includes(networkKey);
            const recipientCount = (recipientsList[networkKey] || []).length;
            return (
              <CCol md={12} key={index}>
                <ul className="inlinedisplay">
                  <li className="divCircle">
                    <IconComponent className="BlazorIcon" fontSize="large" color="success" />
                  </li>

                  <li className='network-checkbox-animate networksListWidth'>
                    <CFormCheck
                      id={IconName}
                      name={IconName}
                      label={networkKey}
                      checked={!isChecked}
                      onChange={() => handleCheckboxChange(networkKey)}
                    />
                  </li>

                  <li style={{ position: 'relative' }}>
                    <CustomInput
                      disabled={isChecked}
                      type="text"
                      value={recipientInput[networkKey] || ''}
                      placeholder="Enter recipient and press Enter"
                      onChange={(e) => handleInputChange(networkKey, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, networkKey)}
                    />

                    {recipientCount > 0 && (
                      <>
                        <span
                          className="recipient-count"
                          onClick={() => {
                            const dropdown = document.getElementById(`recipients-${networkKey}`);
                            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                          }}
                        >
                          {recipientCount}
                        </span>

                        <div id={`recipients-${networkKey}`} className="recipient-dropdown">
                          {(recipientsList[networkKey] || []).map((rec, idx) => (
                            <div key={idx} className="recipient-tag">
                              {rec}
                              <span
                                className="delete-icon"
                                onClick={() => handleDeleteRecipient(networkKey, idx)}
                              >
                                &times;
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}


                    <div id={`recipients-${networkKey}`} className="recipient-dropdown">
                      {(recipientsList[networkKey] || []).map((rec, idx) => (
                        <div key={idx} className="recipient-tag">
                          {rec}
                          <span
                            className="delete-icon"
                            onClick={() => handleDeleteRecipient(networkKey, idx)}
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>

                  <li>
                    <CustomInput
                      type="file"
                      accept=".csv, .xls, .xlsx"
                      disabled={isChecked}
                      onChange={(e) => handleCampaignAddContacts(e, networkId)}
                    />
                  </li>
                  {importedData[networkKey]?.length > 0 && (
                    <li className="imported-dropdown">
                      <div className="recipient-dropdown">
                        {importedData[networkKey].map((item, idx) => (
                          <div key={idx} className="recipient-tag">
                            {item}
                          </div>
                        ))}
                      </div>
                    </li>
                  )}

                  <li>
                    <button onClick={() => handleImportClick(networkKey, networkId)} disabled={!selectedFiles[networkId]}>Import</button>

                  </li>
                </ul>
              </CCol>
            );
          })}


            <React.Fragment>
              <div className="CenterAlign pt-2">
              <button
                onClick={() => setConfirmationModalOpen(true)}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Cancel
              </button>

                <button
                //  onClick={() => setActiveTab(2)}
                  type="button"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Save
                </button>
              </div>
            </React.Fragment>
          </React.Fragment>
     
       
       
      </CContainer>


    
      <ConfirmationModal
        header="Confirmation!"
        body="Are you sure you want to cancel?"
        isOpen={confirmationModalOpen}
        onYes={goToAnotherPage}
        onNo={confirmationModal}
      />
     
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignContacts;
