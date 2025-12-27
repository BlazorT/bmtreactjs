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
import {
  faEye,
  faEyeSlash,
  faKey,
  faShieldAlt,
  faExclamationTriangle,
  faCheckCircle,
  faAngleUp,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import rt from 'dayjs/plugin/relativeTime';
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
import Form from 'src/components/UI/Form';
import { useShowToast } from 'src/hooks/useShowToast';
import { formatDateTime, formatDate } from 'src/helpers/formatDate';

dayjs.extend(utc);
dayjs.extend(rt);

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
  const showToast = useShowToast();

  const {
    data: networkRes,
    postData: fetchNetworks,
    loading: networkLoading,
  } = useApi('/Admin/custombundlingdetails');

  const {
    data: orgKeysRes,
    postData: getApiKeys,
    loading: apiKeysLoading,
  } = useApi('/Admin/orglicenses');

  const { postData: submitApiKey, loading: submitLoading } = useApi('/Admin/addupdateorglicense');

  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [formData, setFormData] = useState(defaultFormValues);
  const [errors, setErrors] = useState({});

  const { postData: authenticateUser, loading: authenticationLoading } = useApi(
    `/Common/login?email=${user?.userInfo?.email}&password=${formData.password}`,
  );

  const loading = useMemo(
    () => apiKeysLoading || submitLoading || networkLoading || authenticationLoading,
    [apiKeysLoading, submitLoading, networkLoading, authenticationLoading],
  );

  const networks = useMemo(
    () => networkRes?.data?.map((n) => ({ id: n?.networkId, name: n?.name })) || [],
    [networkRes],
  );

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
    await getApiKeys({
      id: 0,
      orgId: user?.orgId,
      networkId: 0,
      status: 0,
      createdAt: dayjs().utc().subtract(100, 'years').format(),
      expiryDate: dayjs().utc().format(),
      rowVer: 0,
    });
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

  const checkUser = async () => {
    const res = await authenticateUser();
    if (res?.status == true) {
      return true;
    }
    showToast(res?.message, 'error');
    return false;
  };

  const handleGenerateKey = async () => {
    if (!validateForm()) return;

    const isUserAuthenticated = await checkUser();
    if (!isUserAuthenticated) return;

    const keyPrefix = getKeyPrefix(formData.keyType);
    const generatedAccessKey = `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    if (formData.applyToAll) {
      // Create keys for all available networks
      const availableNetworks = getAvailableNetworks();
      const apiKeyBody = [];
      for (const network of availableNetworks) {
        const networkBody = {
          id: 0,
          orgId: user?.orgId,
          Primarykey: formData.publicKey,
          Accesskey: `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          ExpiryDate: formData.expiryDate ? dayjs(formData.expiryDate).utc().format() : null,
          NetworkId: Number(network.id),
          Status: Number(formData.status),
          IsProduction: formData.keyType == 2 ? 1 : 0,
          Name: '',
          Description: '',
          CreatedBy: user?.userId,
          lastUpdatedBy: user?.userId,
          LastUpdatedAt: dayjs().utc().format(),
          CreatedAt: dayjs().utc().format(),
          RowVer: 0,
        };
        apiKeyBody.push(networkBody);
      }
      console.log({ apiKeyBody });
      const res = await submitApiKey(apiKeyBody);

      if (!res || !res?.status) {
        showToast(res?.message || `Failed to generate keys`, 'error');
        return;
      }
      showToast('API keys generated successfully for all networks', 'success');
      await fetchApiKeys();
    } else {
      // Create single key for selected network
      const networkName =
        globalutil.networks().find((n) => n.id == formData.selectedNetwork)?.name || '';
      const desc = `${networkName}_${formData.publicKey}`;
      const apiKeyBody = [
        {
          id: 0,
          orgId: user?.orgId,
          Primarykey: formData.publicKey,
          Accesskey: generatedAccessKey,
          ExpiryDate: formData.expiryDate ? dayjs(formData.expiryDate).utc().format() : null,
          NetworkId: Number(formData.selectedNetwork),
          Status: Number(formData.status),
          IsProduction: formData.keyType == 2 ? 1 : 0,
          Name: desc || '',
          Description: desc || '',
          CreatedBy: user?.userId,
          lastUpdatedBy: user?.userId,
          LastUpdatedAt: dayjs().utc().format(),
          CreatedAt: dayjs().utc().format(),
          RowVer: 0,
        },
      ];
      console.log({ apiKeyBody });
      const res = await submitApiKey(apiKeyBody);

      if (res && res?.status) {
        showToast(res?.message || 'API key generated successfully', 'success');
        await fetchApiKeys();
      } else {
        showToast(res?.message || 'Something went wrong generating key, try again later', 'error');
        return;
      }
    }

    setShowModal(false);
    resetForm();
  };

  const handleUpdateKey = async () => {
    if (!validateForm()) return;

    const isUserAuthenticated = await checkUser();
    if (!isUserAuthenticated) return;

    const expired = isKeyExpired(editingKey.expiryDate);
    const keyPrefix = getKeyPrefix(formData.keyType);

    // Update single key
    const apiKeyBody = [
      {
        id: editingKey.id, // Pass the ID for update
        orgId: user?.orgId,
        Primarykey: formData.publicKey,
        Accesskey: expired
          ? `${keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          : editingKey.accesskey, // Keep existing if not expired
        ExpiryDate: formData.expiryDate ? dayjs(formData.expiryDate).utc().format() : null,
        NetworkId: Number(formData.selectedNetwork),
        Status: Number(formData.status),
        IsProduction: formData.keyType == 2 ? 1 : 0,
        Name: editingKey.name || '',
        Description: editingKey.description || '',
        CreatedBy: editingKey.createdBy,
        lastUpdatedBy: user?.userId,
        LastUpdatedAt: dayjs().utc().format(),
        CreatedAt: editingKey.createdAt,
        RowVer: editingKey.rowVer,
      },
    ];

    console.log({ apiKeyBody });
    const res = await submitApiKey(apiKeyBody);

    if (res && res?.status) {
      showToast(
        res?.message ||
          (expired ? 'API key regenerated successfully' : 'API key updated successfully'),
        'success',
      );
      await fetchApiKeys();
    } else {
      showToast(res?.message || 'Something went wrong updating key, try again later', 'error');
      return;
    }

    setShowModal(false);
    setEditingKey(null);
    resetForm();
  };

  const handleEditKey = (key) => {
    const expired = isKeyExpired(key.expiryDate);

    setEditingKey(key);
    setShowModal(true);
    setFormData({
      publicKey: expired ? '' : key.primarykey,
      password: '',
      expiryDate: expired ? null : key.expiryDate ? dayjs(key.expiryDate).toDate() : null,
      expiryPreset: '',
      applyToAll: false,
      selectedNetwork: key.networkId?.toString() || '',
      status: expired ? 1 : key.status?.toString(),
      keyType: (key.isProduction === 1 ? 2 : 1)?.toString(),
    });
  };

  const resetForm = () => {
    setFormData(defaultFormValues);
    setErrors({});
    setEditingKey(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'keyType') {
      const newFormData = { ...formData, [name]: value };

      // Sandbox (1) - default to 15 days
      if (value == 1) {
        newFormData.expiryDate = dayjs().add(15, 'days').toDate();
        newFormData.expiryPreset = '1';
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
    return '•'.repeat(Math.min(key.length, 20));
  };

  const getAvailableNetworks = () => {
    if (editingKey) {
      return networks;
    }

    if (!formData.keyType) {
      return networks;
    }

    const usedNetworkIdsForType =
      orgKeysRes?.data
        ?.filter((key) => (key.isProduction === 1 ? 2 : 1) == formData.keyType)
        .map((key) => key.networkId) || [];

    return networks.filter((network) => !usedNetworkIdsForType.includes(network.id));
  };

  // Transform API keys data for grid
  const gridRows = useMemo(() => {
    return (
      orgKeysRes?.data?.map((key) => ({
        ...key, // Spread all original properties
        publicKey: key?.primarykey || '',
        apiKey: key?.accesskey,
        expiryDate: key.expiryDate ? dayjs(key.expiryDate).format() : null,
        keyType: key?.isProduction === 1 ? 2 : 1,
        keyTypeName:
          keyTypeOptions.find((kt) => kt.id === (key?.isProduction === 1 ? 2 : 1))?.name || '--',
        networkName: globalutil.networks().find((n) => n.id === key.networkId)?.name || '--',
        statusName: statusOptions.find((s) => s.id === key.status)?.name || '--',
        isExpired: isKeyExpired(key.expiryDate),
      })) || []
    );
  }, [orgKeysRes]);

  // Grid columns with modern styling
  const columns = useMemo(
    () => [
      {
        key: 'keyTypeName',
        name: 'Key Type',
        renderGroupCell: ({ row }) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center ${
                  row.groupKey === 'Live' ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'
                }`}
                style={{ width: '36px', height: '36px', minWidth: '36px' }}
              >
                <FontAwesomeIcon
                  icon={row.groupKey === 'Live' ? faShieldAlt : faKey}
                  className={row.groupKey === 'Live' ? 'text-success' : 'text-warning'}
                />
              </div>
              <div className="d-flex flex-column">
                <span className="fw-semibold">{row.groupKey}</span>
              </div>
              <FontAwesomeIcon icon={row?.isExpanded ? faAngleDown : faAngleUp} />
            </div>
          );
        },
      },
      {
        key: 'networkName',
        name: 'Network',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-center">
            <span
              className="badge bg-light text-white border border-secondary px-2 py-2"
              style={{ fontSize: '0.875rem', fontWeight: '500' }}
            >
              {row.networkName}
            </span>
          </div>
        ),
      },
      {
        key: 'publicKey',
        name: 'Public Key',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center gap-1">
            <div
              className="bg-dark bg-opacity-75 rounded px-3 py-1 flex-grow-1"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            >
              {visibleKeys[row.id] ? row.publicKey : maskKey(row.publicKey)}
            </div>
            <button
              className="btn btn-sm text-dim rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => toggleKeyVisibility(row.id)}
              title={visibleKeys[row.id] ? 'Hide' : 'Show'}
            >
              <FontAwesomeIcon icon={visibleKeys[row.id] ? faEyeSlash : faEye} size="sm" />
            </button>
          </div>
        ),
      },
      {
        key: 'apiKey',
        name: 'Private Key',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center gap-1">
            <div
              className="bg-dark bg-opacity-75 text-white rounded px-3 py-1 flex-grow-1"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            >
              {visibleKeys[`private-${row.id}`] ? row.apiKey : maskKey(row.apiKey)}
            </div>
            <button
              className="btn btn-sm text-dim rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => toggleKeyVisibility(`private-${row.id}`)}
              title={visibleKeys[`private-${row.id}`] ? 'Hide' : 'Show'}
            >
              <FontAwesomeIcon
                icon={visibleKeys[`private-${row.id}`] ? faEyeSlash : faEye}
                size="sm"
              />
            </button>
          </div>
        ),
      },
      {
        key: 'statusName',
        name: 'Status',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-center">
            {row.isExpired ? (
              <span
                className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2"
                style={{ fontSize: '0.875rem' }}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1 text-danger" />
                Expired
              </span>
            ) : (
              <span
                className={`badge px-3 py-2 ${
                  row.status === 1
                    ? 'bg-success bg-opacity-10 text-success border border-success'
                    : row.status === 2
                      ? 'bg-secondary bg-opacity-10 text-secondary border border-secondary'
                      : 'bg-warning bg-opacity-10 text-warning border border-warning'
                }`}
                style={{ fontSize: '0.875rem' }}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className={
                    row.status === 1
                      ? 'text-success me-1'
                      : row.status === 2
                        ? 'text-secondary me-1'
                        : 'text-warning me-1'
                  }
                />
                {row.statusName}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'expiryDate',
        name: 'Expiry Date',
        renderCell: ({ row }) => (
          <div className="d-flex flex-column">
            <span className={`${row.isExpired ? 'text-danger fw-bold' : 'text-white fw-semibold'}`}>
              {formatDate(row.expiryDate) || 'No expiry'}
            </span>
            {row.expiryDate && !row.isExpired && (
              <small className="text-dim">Expires {dayjs(row.expiryDate).fromNow()}</small>
            )}
            {row.isExpired && (
              <small className="text-dim">Expired {dayjs(row.expiryDate).fromNow()}</small>
            )}
          </div>
        ),
      },
      {
        key: 'action',
        name: 'Action',
        renderCell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <button
              className={`btn btn-sm text-white ${
                row.isExpired ? 'btn-danger' : 'btn-primary'
              } d-flex align-items-center gap-2 px-2 py-1`}
              onClick={() => handleEditKey(row)}
              disabled={loading}
              title={row.isExpired ? 'Regenerate Key' : 'Edit'}
            >
              <CIcon icon={cilPencil} className="sm-icon" />
              <span>{row.isExpired ? 'Regenerate' : 'Edit'}</span>
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
        rowHeight={60}
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
              {formData.keyType && (
                <CCol md={formData.applyToAll ? 12 : 6}>
                  <CFormCheck
                    id="applyToAll"
                    label="Apply to all networks"
                    checked={formData.applyToAll}
                    onChange={handleCheckboxChange}
                    className="mt-2 pt-4"
                    disabled={editingKey || getAvailableNetworks()?.length === 0}
                  />
                </CCol>
              )}
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
              loading={loading}
              type="submit"
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
