/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilCalendar, cilLockLocked, cilLockUnlocked, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CCard,
  CCardBody,
  CCol,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formValidator } from 'src/helpers/formValidator';
import globalutil from 'src/util/globalutil';
import CustomInput from '../InputsComponent/CustomInput';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import Button from '../UI/Button';
import CustomDatePicker from '../UI/DatePicker';
import Form from '../UI/Form';

dayjs.extend(utc);

const networks = globalutil.networks();

const statusOptions = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
  { id: 3, name: 'Suspend' },
];

const OrgAccessKeyModal = ({ isOpen, toggle }) => {
  const user = useSelector((state) => state.user);

  // const showConfirmation = useShowConfirmation();

  const [publicKeySearch, setPublicKeySearch] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    publicKey: '',
    password: '',
    expiryDate: null,
    applyToAll: false,
    selectedNetwork: '',
    status: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    fetchApiKeys();
  }, [isOpen]);

  const fetchApiKeys = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockKeys = [
      {
        id: 1,
        organizationId: 1,
        publicKey: '123456',
        apiKey: 'abcdefghijklmnopqrstuvwxyz123456',
        networkId: 1,
        expiryDate: dayjs().add(1, 'year').format('MM/DD/YYYY'),
        status: 1,
      },
      {
        id: 2,
        organizationId: 1,
        publicKey: '789012',
        apiKey: 'abc165a1dada6sd46asd',
        networkId: 2,
        expiryDate: dayjs().add(6, 'months').format('MM/DD/YYYY'),
        status: 1,
      },
      {
        id: 3,
        organizationId: 1,
        publicKey: '345678',
        apiKey: 'qwertyuiopasdfghjklzxcvbnm345678',
        networkId: 1,
        expiryDate: null,
        status: 2,
      },
    ];
    setApiKeys(mockKeys);
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.publicKey.trim()) {
      newErrors.publicKey = 'Public key is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (user?.roleId === 1 && !formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!formData.applyToAll && !formData.selectedNetwork) {
      newErrors.selectedNetwork = 'Please select a network or apply to all';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);

    formValidator();
    const form = document.querySelector('.api-keys-form');
    if (!form?.checkValidity()) {
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateKey = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newKey = {
      id: Date.now(),
      organizationId: 1,
      publicKey: formData.publicKey,
      apiKey: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      password: formData.password,
      expiryDate: formData.expiryDate ? dayjs(formData.expiryDate).format('MM/DD/YYYY') : null,
      networkId: formData.applyToAll ? 'all' : formData.selectedNetwork,
      status: formData.status,
    };

    // Add to list after showing the key
    setTimeout(() => {
      setApiKeys((prev) => [newKey, ...prev]);
      setShowGenerateForm(false);
      resetForm();
      setLoading(false);
    }, 3000);
  };

  const handleEditKey = (key) => {
    setEditingKey(key);
    setShowGenerateForm(true);
    setFormData({
      publicKey: key.publicKey,
      password: '',
      expiryDate: key.expiryDate ? dayjs(key.expiryDate).toDate() : null,
      applyToAll: key.networkId === 'all',
      selectedNetwork: key.networkId !== 'all' ? key.networkId : '',
      status: key.status,
    });
  };

  const handleUpdateKey = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedKey = {
      ...editingKey,
      publicKey: formData.publicKey,
      expiryDate: formData.expiryDate ? dayjs(formData.expiryDate).format('MM/DD/YYYY') : null,
      networkId: formData.applyToAll ? 'all' : formData.selectedNetwork,
      status: formData.status,
    };

    setApiKeys((prev) => prev.map((key) => (key.id === editingKey.id ? updatedKey : key)));

    setShowGenerateForm(false);
    setEditingKey(null);
    resetForm();
    setLoading(false);
  };

  // const handleDeleteKey = async (keyId, networkName, status) => {
  //   showConfirmation({
  //     isOpen: true,
  //     header: 'Confirmation!',
  //     body: `Are you sure you want to ${status === 1 ? 're-activate' : 'in-active'} API key for ${networkName}?`,
  //     onNo: closeConfirmation,
  //     onYes: () => onDelConfirmation(keyId, status),
  //   });
  // };

  // const onDelConfirmation = async (keyId, status) => {
  //   closeConfirmation();
  //   setLoading(true);

  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
  //   setLoading(false);
  // };

  // const closeConfirmation = () => {
  //   showConfirmation({
  //     isOpen: false,
  //   });
  // };

  const resetForm = () => {
    setFormData({
      publicKey: '',
      password: '',
      expiryDate: null,
      applyToAll: false,
      selectedNetwork: '',
      status: '',
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      applyToAll: checked,
      selectedNetwork: checked ? '' : prev.selectedNetwork,
    }));
    if (errors.selectedNetwork) {
      setErrors((prev) => ({ ...prev, selectedNetwork: '' }));
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const maskKey = (key) => {
    return '*'.repeat(key.length);
  };

  // Get networks that don't have keys yet
  const getAvailableNetworks = () => {
    if (editingKey) {
      // When editing, show all networks except those already used by other keys
      return networks;
    }
    // When creating new, only show networks without keys
    const usedNetworkIds = apiKeys.map((key) => key.networkId);
    return networks.filter((network) => !usedNetworkIds.includes(network.id));
  };

  const filteredApiKeys = apiKeys.filter((key) => {
    const publicKeyMatch =
      !publicKeySearch || key.publicKey.toLowerCase().includes(publicKeySearch.toLowerCase());
    return publicKeyMatch;
  });

  return (
    <CModal visible={isOpen} alignment="center" backdrop="static" size="xl">
      <CModalHeader closeButton={false} className="d-flex flex-column py-2 px-0">
        <CModalTitle>API Key Management</CModalTitle>
        <CRow className="w-100 justify-content-center align-items-center">
          <CustomInput
            placeholder="Search by public key..."
            value={publicKeySearch}
            onChange={(e) => setPublicKeySearch(e.target.value)}
            width={'w-100'}
          />
        </CRow>
      </CModalHeader>

      <CModalBody className="gap-3 d-flex flex-column">
        {!showGenerateForm && (
          <Button
            title="Generate API Key"
            onClick={() => setShowGenerateForm(true)}
            className="fit-content-width px-4"
            loading={loading}
          />
        )}

        {/* Generate/Edit Form */}
        {showGenerateForm && (
          <Form name="api-keys-form">
            <CCard className="border">
              <CCardBody>
                <h5>{editingKey ? 'Edit API Key' : 'Generate New API Key'}</h5>
                <CRow>
                  <CCol md={6}>
                    <CustomInput
                      label="Public Key"
                      name="publicKey"
                      placeholder="Enter public key"
                      value={formData.publicKey}
                      onChange={handleInputChange}
                      icon={cilLockUnlocked}
                      isRequired={!!errors.publicKey}
                      message={errors.publicKey}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CustomInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      icon={cilLockLocked}
                      isRequired={!!errors.password}
                      message={errors.password}
                    />
                  </CCol>
                </CRow>

                <CRow>
                  {!formData.applyToAll && (
                    <CCol md={6}>
                      <CustomSelectInput
                        label="Network"
                        name="selectedNetwork"
                        options={getAvailableNetworks()}
                        value={formData.selectedNetwork}
                        onChange={handleInputChange}
                        icon={cilLockLocked}
                        isRequired={!!errors.selectedNetwork}
                        message={errors.selectedNetwork}
                        disableOption="Select network"
                        disabled={editingKey}
                      />
                    </CCol>
                  )}
                  <CCol md={6}>
                    <CustomSelectInput
                      label="Status"
                      name="status"
                      options={statusOptions}
                      value={formData.status}
                      onChange={handleInputChange}
                      icon={cilLockLocked}
                      isRequired={!!errors.status}
                      message={errors.status}
                      disableOption="Select status"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  {user?.roleId === 1 && (
                    <CCol md={6}>
                      <CustomDatePicker
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={(date) => {
                          setFormData((prev) => ({ ...prev, expiryDate: date }));
                          if (errors.expiryDate) {
                            setErrors((prev) => ({ ...prev, expiryDate: '' }));
                          }
                        }}
                        icon={cilCalendar}
                        disablePast={true}
                        isRequired={!!errors.expiryDate}
                        message={errors.expiryDate}
                      />
                    </CCol>
                  )}
                  <CCol md={6}>
                    <CFormCheck
                      id="applyToAll"
                      label="Apply to all networks"
                      checked={formData.applyToAll}
                      onChange={handleCheckboxChange}
                      className={user?.roleId === 1 ? 'mt-2 pt-4' : ''}
                    />
                  </CCol>
                </CRow>

                <div className="d-flex gap-2 mt-3">
                  <Button
                    title={editingKey ? 'Update Key' : 'Generate Key'}
                    onClick={editingKey ? handleUpdateKey : handleGenerateKey}
                    className="w-auto px-4"
                    type="submit"
                    loading={loading}
                  />
                  <Button
                    title="Cancel"
                    onClick={() => {
                      setShowGenerateForm(false);
                      setEditingKey(null);
                      resetForm();
                    }}
                    className="w-auto px-4"
                    disabled={loading}
                  />
                </div>
              </CCardBody>
            </CCard>
          </Form>
        )}

        {/* API Keys List */}
        <div>
          <h5>Existing API Keys</h5>
          {loading && !showGenerateForm ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2 text-muted">Loading API keys...</p>
            </div>
          ) : filteredApiKeys.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No API keys found</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredApiKeys.map((key) => (
                <CCard key={key.id} className="border border-secondary">
                  <CCardBody>
                    <CRow className="align-items-center">
                      <CCol md={2}>
                        <small className="text-muted">Network</small>
                        <div className="fw-semibold">
                          {globalutil.networks().find((n) => n.id === key.networkId)?.name || '--'}
                        </div>
                      </CCol>
                      <CCol md={2}>
                        <small className="text-muted">Public Key</small>
                        <div className="fw-semibold d-flex align-items-center gap-2">
                          <span
                            title={visibleKeys[key.id] ? key.publicKey : ''}
                            className="text-truncate"
                            style={{ maxWidth: '120px' }}
                          >
                            {visibleKeys[key.id] ? key.publicKey : maskKey(key.publicKey)}
                          </span>
                          <button
                            className="btn btn-sm btn-link text-secondary p-0"
                            onClick={() => toggleKeyVisibility(key.id)}
                            title={visibleKeys[key.id] ? 'Hide' : 'Show'}
                          >
                            <FontAwesomeIcon icon={visibleKeys[key.id] ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </CCol>
                      <CCol md={2}>
                        <small className="text-muted">Private Key</small>
                        <div className="fw-semibold d-flex align-items-center gap-2">
                          <span
                            title={visibleKeys[`private-${key.id}`] ? key.apiKey : ''}
                            className="text-truncate"
                            style={{ maxWidth: '120px' }}
                          >
                            {visibleKeys[`private-${key.id}`] ? key.apiKey : maskKey(key.apiKey)}
                          </span>
                          <button
                            className="btn btn-sm btn-link text-secondary p-0"
                            onClick={() => toggleKeyVisibility(`private-${key.id}`)}
                            title={visibleKeys[`private-${key.id}`] ? 'Hide' : 'Show'}
                          >
                            <FontAwesomeIcon
                              icon={visibleKeys[`private-${key.id}`] ? faEyeSlash : faEye}
                            />
                          </button>
                        </div>
                      </CCol>
                      <CCol md={2}>
                        <small className="text-muted">Status</small>
                        <div className="fw-semibold">
                          <span
                            className={`badge ${
                              key.status === 1
                                ? 'bg-success'
                                : key.status === 2
                                  ? 'bg-secondary'
                                  : 'bg-warning'
                            }`}
                          >
                            {statusOptions.find((s) => s.id == key.status)?.name || '--'}
                          </span>
                        </div>
                      </CCol>
                      <CCol md={2}>
                        <small className="text-muted">Expiry Date</small>
                        <div className="fw-semibold">{key.expiryDate || 'No expiry'}</div>
                      </CCol>
                      <CCol md={2} className="text-end">
                        <button
                          className="btn btn-sm btn-link text-primary p-1"
                          onClick={() => handleEditKey(key)}
                          disabled={loading}
                          title="Edit"
                        >
                          <CIcon icon={cilPencil} size="lg" />
                        </button>
                        {/* <button
                              className="btn btn-sm btn-link text-danger p-1"
                              onClick={() =>
                                handleDeleteKey(
                                  key.id,
                                  globalutil.networks().find((n) => n.id === key.networkId)?.name ||
                                    '--',
                                  2,
                                )
                              }
                              disabled={loading}
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} size="lg" />
                            </button> */}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              ))}
            </div>
          )}
        </div>
      </CModalBody>

      <CModalFooter>
        <Button title="Close" onClick={toggle} disabled={loading} />
      </CModalFooter>
    </CModal>
  );
};

export default OrgAccessKeyModal;
