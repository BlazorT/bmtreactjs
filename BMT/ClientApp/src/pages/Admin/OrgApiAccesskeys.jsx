/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilCalendar, cilLockLocked, cilLockUnlocked, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CCol,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import AppContainer from 'src/components/UI/AppContainer';
import { formValidator } from 'src/helpers/formValidator';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';
import CustomInput from '../../components/InputsComponent/CustomInput';
import CustomSelectInput from '../../components/InputsComponent/CustomSelectInput';
import Button from '../../components/UI/Button';
import CustomDatePicker from '../../components/UI/DatePicker';
import Form from '../../components/UI/Form';

dayjs.extend(utc);

const statusOptions = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
  { id: 3, name: 'Suspend' },
];

const keyTypeOptions = [
  { id: 1, name: 'Sandbox' },
  { id: 2, name: 'Live' },
];

const expiryPresetOptions = [
  { id: 1, name: '15 Days', days: 15 },
  { id: 2, name: '1 Month', months: 1 },
  { id: 3, name: '3 Months', months: 3 },
  { id: 4, name: '6 Months', months: 6 },
  { id: 5, name: '1 Year', years: 1 },
];

const defaultFormValues = {
  publicKey: '',
  password: '',
  expiryDate: null,
  expiryPreset: '',
  applyToAll: false,
  selectedNetwork: '',
  status: 1,
  keyType: '',
};

const OrgApiAccesskeys = () => {
  const user = useSelector((state) => state.user);

  const {
    data: networkRes,
    postData: fetchNetworks,
    loading: networkLoading,
  } = useApi('/Admin/custombundlingdetails');

  const networks = useMemo(
    () => networkRes?.data?.map((n) => ({ id: n?.networkId, name: n?.name }) || []),
    [networkRes],
  );

  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  // Form state
  const [formData, setFormData] = useState(defaultFormValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchNetworks({
      orgId: String(user.orgId),
      userId: String(user.userId),
      roleId: String(user.roleId),
      dateto: new Date().toISOString(),
    });
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockKeys = [
      {
        id: 1,
        organizationId: 1,
        publicKey: '123456',
        apiKey: 'mock_key_example_1234567890',
        networkId: 1,
        expiryDate: dayjs().add(1, 'year').format('MM/DD/YYYY'),
        status: 1,
        keyType: 2, // Live
      },
      {
        id: 2,
        organizationId: 1,
        publicKey: '789012',
        apiKey: 'mock_key_example_abcdefgh',
        networkId: 2,
        expiryDate: dayjs().subtract(2, 'months').format('MM/DD/YYYY'), // Expired
        status: 1,
        keyType: 1, // Sandbox
      },
      {
        id: 3,
        organizationId: 1,
        publicKey: '345678',
        apiKey: 'mock_key_example_xyz123',
        networkId: 1,
        expiryDate: dayjs().add(3, 'months').format('MM/DD/YYYY'),
        status: 2,
        keyType: 1, // Sandbox
      },
      {
        id: 4,
        organizationId: 1,
        publicKey: '567890',
        apiKey: 'mock_key_example_qwerty',
        networkId: 2,
        expiryDate: dayjs().subtract(10, 'days').format('MM/DD/YYYY'), // Expired
        status: 1,
        keyType: 2, // Live
      },
    ];
    setApiKeys(mockKeys);
    setLoading(false);
  };

  const isKeyExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return dayjs(expiryDate).isBefore(dayjs(), 'day');
  };

  const getKeyPrefix = (keyType) => {
    return keyType == 1 ? 'SB-' : 'LV-';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.publicKey.trim()) {
      newErrors.publicKey = 'Public key is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.keyType) {
      newErrors.keyType = 'Key type is required';
    }

    if (user?.roleId === 1 && !formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    // For Live keys, expiry date is required
    if (formData.keyType == 2 && !formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required for Live keys';
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

    const keyPrefix = getKeyPrefix(formData.keyType);

    if (formData.applyToAll) {
      // Create keys for all available networks
      const availableNetworks = getAvailableNetworks();
      const newKeys = availableNetworks.map((network) => ({
        id: Date.now() + Math.random(), // Ensure unique IDs
        organizationId: 1,
        publicKey: formData.publicKey,
        apiKey: `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        password: formData.password,
        expiryDate: formData.expiryDate ? dayjs(formData.expiryDate).format('MM/DD/YYYY') : null,
        networkId: network.id,
        status: Number(formData.status),
        keyType: Number(formData.keyType),
      }));

      setApiKeys((prev) => [...newKeys, ...prev]);
    } else {
      // Create single key for selected network
      const newKey = {
        id: Date.now(),
        organizationId: 1,
        publicKey: formData.publicKey,
        apiKey: `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        password: formData.password,
        expiryDate: formData.expiryDate ? dayjs(formData.expiryDate).format('MM/DD/YYYY') : null,
        networkId: Number(formData.selectedNetwork),
        status: Number(formData.status),
        keyType: Number(formData.keyType),
      };

      setApiKeys((prev) => [newKey, ...prev]);
    }

    setShowModal(false);
    resetForm();
    setLoading(false);
  };

  const handleUpdateKey = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const expired = isKeyExpired(editingKey.expiryDate);
    const keyPrefix = getKeyPrefix(formData.keyType);

    if (formData.applyToAll && expired) {
      // When regenerating expired key with "apply to all"
      // Remove the old key and create new keys for all available networks
      const availableNetworks = getAvailableNetworks();
      const newKeys = availableNetworks.map((network) => ({
        id: Date.now() + Math.random(), // Ensure unique IDs
        organizationId: 1,
        publicKey: formData.publicKey,
        apiKey: `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        password: formData.password,
        expiryDate: formData.expiryDate ? dayjs(formData.expiryDate).format('MM/DD/YYYY') : null,
        networkId: network.id,
        status: Number(formData.status),
        keyType: Number(formData.keyType),
      }));

      // Remove old key and add new keys
      setApiKeys((prev) => [...newKeys, ...prev.filter((key) => key.id !== editingKey.id)]);
    } else {
      // Update single key
      const updatedKey = {
        ...editingKey,
        publicKey: formData.publicKey,
        apiKey: expired
          ? `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          : editingKey.apiKey,
        expiryDate: formData.expiryDate ? dayjs(formData.expiryDate).format('MM/DD/YYYY') : null,
        networkId: Number(formData.selectedNetwork),
        status: Number(formData.status),
        keyType: Number(formData.keyType),
      };

      setApiKeys((prev) => prev.map((key) => (key.id === editingKey.id ? updatedKey : key)));
    }

    setShowModal(false);
    setEditingKey(null);
    resetForm();
    setLoading(false);
  };

  const handleEditKey = (key) => {
    const expired = isKeyExpired(key.expiryDate);

    setEditingKey(key);
    setShowModal(true);
    setFormData({
      publicKey: expired ? '' : key.publicKey,
      password: '',
      expiryDate: expired ? null : key.expiryDate ? dayjs(key.expiryDate).toDate() : null,
      expiryPreset: '',
      applyToAll: key.networkId === 'all',
      selectedNetwork: key.networkId !== 'all' ? key.networkId?.toString() : '',
      status: expired ? 1 : key.status?.toString(),
      keyType: key.keyType?.toString(),
    });
  };

  const resetForm = () => {
    setFormData(defaultFormValues);
    setErrors({});
    setEditingKey(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If key type changes, set default expiry date
    if (name === 'keyType') {
      const newFormData = { ...formData, [name]: value };

      // Sandbox (1) - default to 15 days
      if (value == 1) {
        newFormData.expiryDate = dayjs().add(15, 'days').toDate();
        newFormData.expiryPreset = '1'; // 15 Days preset
      }
      // Live (2) - no default, user must select
      else if (value == 2) {
        newFormData.expiryDate = null;
        newFormData.expiryPreset = '';
      }

      setFormData(newFormData);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleExpiryPresetChange = (e) => {
    const presetId = e.target.value;

    if (!presetId) {
      setFormData((prev) => ({ ...prev, expiryPreset: '' }));
      return;
    }

    const preset = expiryPresetOptions.find((p) => p.id == presetId);

    if (preset) {
      let newDate;

      if (preset.days) {
        newDate = dayjs().add(preset.days, 'days').toDate();
      } else if (preset.months) {
        newDate = dayjs().add(preset.months, 'months').toDate();
      } else if (preset.years) {
        newDate = dayjs().add(preset.years, 'years').toDate();
      }

      setFormData((prev) => ({
        ...prev,
        expiryDate: newDate,
        expiryPreset: presetId,
      }));

      if (errors.expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: '' }));
      }
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

  const getAvailableNetworks = () => {
    if (editingKey) {
      return networks;
    }

    if (!formData.keyType) {
      return networks;
    }

    const usedNetworkIdsForType = apiKeys
      .filter((key) => key.keyType == formData.keyType)
      .map((key) => key.networkId);

    return networks.filter((network) => !usedNetworkIdsForType.includes(network.id));
  };

  // Transform API keys data for grid
  const gridRows = useMemo(() => {
    return apiKeys.map((key) => ({
      ...key,
      content: key.id,
      keyTypeName: keyTypeOptions.find((kt) => kt.id === key.keyType)?.name || '--',
      networkName: globalutil.networks().find((n) => n.id === key.networkId)?.name || '--',
      statusName: statusOptions.find((s) => s.id === key.status)?.name || '--',
      isExpired: isKeyExpired(key.expiryDate),
    }));
  }, [apiKeys]);

  // Grid columns
  const columns = useMemo(
    () => [
      {
        key: 'keyTypeName',
        name: 'Key Type',
      },
      {
        key: 'networkName',
        name: 'Network',
      },
      {
        key: 'publicKey',
        name: 'Public Key',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span className="text-truncate">
              {visibleKeys[row.id] ? row.publicKey : maskKey(row.publicKey)}
            </span>
            <button
              className="btn btn-sm btn-link text-secondary p-0"
              onClick={() => toggleKeyVisibility(row.id)}
              title={visibleKeys[row.id] ? 'Hide' : 'Show'}
            >
              <FontAwesomeIcon
                icon={visibleKeys[row.id] ? faEyeSlash : faEye}
                size="sm"
                className="text-dim"
              />
            </button>
          </div>
        ),
      },
      {
        key: 'apiKey',
        name: 'Private Key',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span className="text-truncate">
              {visibleKeys[`private-${row.id}`] ? row.apiKey : maskKey(row.apiKey)}
            </span>
            <button
              className="btn btn-sm btn-link text-secondary p-0"
              onClick={() => toggleKeyVisibility(`private-${row.id}`)}
              title={visibleKeys[`private-${row.id}`] ? 'Hide' : 'Show'}
            >
              <FontAwesomeIcon
                icon={visibleKeys[`private-${row.id}`] ? faEyeSlash : faEye}
                size="sm"
                className="text-dim"
              />
            </button>
          </div>
        ),
      },
      {
        key: 'statusName',
        name: 'Status',
        renderCell: ({ row }) => (
          <>
            {row.isExpired ? (
              <span className="badge bg-danger">Expired</span>
            ) : (
              <span
                className={`badge ${
                  row.status === 1 ? 'bg-success' : row.status === 2 ? 'bg-secondary' : 'bg-warning'
                }`}
              >
                {row.statusName}
              </span>
            )}
          </>
        ),
      },
      {
        key: 'expiryDate',
        name: 'Expiry Date',
        renderCell: ({ row }) => (
          <span className={row.isExpired ? 'text-danger fw-semibold' : ''}>
            {row.expiryDate || 'No expiry'}
          </span>
        ),
      },
      {
        key: 'action',
        name: 'Action',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <button
              className="btn btn-sm btn-link text-primary p-0"
              onClick={() => handleEditKey(row)}
              disabled={loading}
              title={row.isExpired ? 'Regenerate Key' : 'Edit'}
            >
              <CIcon icon={cilPencil} size="lg" />
            </button>
          </div>
        ),
      },
    ],
    [visibleKeys, loading],
  );

  return (
    <AppContainer>
      <CustomDatagrid
        rows={gridRows}
        columns={columns}
        loading={loading}
        enableGrouping={true}
        groupBy={['keyTypeName']}
        defaultExpandedGroups={true}
        pagination={false}
        // rowHeight={50}
        maxHeight={700}
        enableSearch
        searchPlaceholder="Search by type, network, public keys"
        headerProps={{
          title: 'API Key Management',
          addButton: 'Generate API Key',
          addBtnClick: () => setShowModal(true),
          canExport: true,
          canPrint: true,
          fileName: 'API_Keys',
          filterDisable: true,
        }}
        noRowsMessage="No API keys found. Click 'Generate API Key' to create one."
      />

      {/* Generate/Edit Modal */}
      <CModal
        visible={showModal}
        alignment="center"
        backdrop="static"
        size="lg"
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <CModalHeader closeButton>
          <CModalTitle>
            {editingKey
              ? isKeyExpired(editingKey.expiryDate)
                ? 'Regenerate Expired API Key'
                : 'Edit API Key'
              : 'Generate New API Key'}
          </CModalTitle>
        </CModalHeader>

        <Form name="api-keys-form">
          <CModalBody>
            {editingKey && isKeyExpired(editingKey.expiryDate) && (
              <div className="alert alert-warning mb-3">
                This key has expired. A new private key will be generated upon update.
              </div>
            )}
            <CRow>
              <CCol md={6}>
                <CustomInput
                  label="Public Key"
                  name="publicKey"
                  placeholder="Enter public key"
                  value={formData.publicKey}
                  onChange={handleInputChange}
                  icon={cilLockUnlocked}
                  isRequired={true}
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
                  isRequired={true}
                  message={errors.password}
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <CustomSelectInput
                  label="Key Type"
                  name="keyType"
                  options={keyTypeOptions}
                  value={formData.keyType}
                  onChange={handleInputChange}
                  icon={cilLockLocked}
                  isRequired={true}
                  message={errors.keyType}
                  disableOption="Select key type"
                  disabled={editingKey}
                />
                {formData.keyType && !editingKey && (
                  <small className="text-muted">
                    {formData.keyType == 1
                      ? '* Sandbox keys default to 15 days expiry'
                      : '* Live keys require expiry date selection'}
                  </small>
                )}
              </CCol>
              {!formData.applyToAll && (
                <CCol md={6}>
                  <CustomSelectInput
                    label="Network"
                    name="selectedNetwork"
                    options={getAvailableNetworks()}
                    value={formData.selectedNetwork}
                    onChange={handleInputChange}
                    icon={cilLockLocked}
                    isRequired={true}
                    message={errors.selectedNetwork}
                    disableOption="Select network"
                    disabled={editingKey}
                  />
                </CCol>
              )}
              {formData.applyToAll && (
                <CCol md={6}>
                  <CustomSelectInput
                    label="Status"
                    name="status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={handleInputChange}
                    icon={cilLockLocked}
                    isRequired={true}
                    message={errors.status}
                    disableOption="Select status"
                  />
                </CCol>
              )}
            </CRow>

            <CRow>
              <CCol md={6}>
                <CustomDatePicker
                  label="Expiry Date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, expiryDate: date, expiryPreset: '' }));
                    if (errors.expiryDate) {
                      setErrors((prev) => ({ ...prev, expiryDate: '' }));
                    }
                  }}
                  icon={cilCalendar}
                  disablePast={true}
                  isRequired={true}
                  message={errors.expiryDate}
                />
              </CCol>
              <CCol md={6}>
                <CustomSelectInput
                  label="Quick Date Selection"
                  name="expiryPreset"
                  options={expiryPresetOptions}
                  value={formData.expiryPreset}
                  onChange={handleExpiryPresetChange}
                  icon={cilCalendar}
                  disableOption="Select preset"
                />
              </CCol>
            </CRow>

            <CRow>
              {!formData.applyToAll && (
                <CCol md={6}>
                  <CustomSelectInput
                    label="Status"
                    name="status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={handleInputChange}
                    icon={cilLockLocked}
                    isRequired={true}
                    message={errors.status}
                    disableOption="Select status"
                  />
                </CCol>
              )}
              <CCol md={formData.applyToAll ? 12 : 6}>
                <CFormCheck
                  id="applyToAll"
                  label="Apply to all networks"
                  checked={formData.applyToAll}
                  onChange={handleCheckboxChange}
                  className="mt-2 pt-4"
                  disabled={editingKey}
                />
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <Button
              title={
                editingKey
                  ? isKeyExpired(editingKey.expiryDate)
                    ? 'Regenerate Key'
                    : 'Update Key'
                  : 'Generate Key'
              }
              onClick={editingKey ? handleUpdateKey : handleGenerateKey}
              className="w-auto px-4"
              type="submit"
              loading={loading}
            />
            <Button
              title="Cancel"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="w-auto px-4"
              disabled={loading}
            />
          </CModalFooter>
        </Form>
      </CModal>
    </AppContainer>
  );
};

export default OrgApiAccesskeys;
