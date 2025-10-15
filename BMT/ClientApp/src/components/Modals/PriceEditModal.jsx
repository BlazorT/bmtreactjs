/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { useState, useEffect } from 'react';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../UI/Button';
import { cilInfo, cilDollar, cilTag, cilGift } from '@coreui/icons';
import globalutil from 'src/util/globalutil';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import CustomInput from '../InputsComponent/CustomInput';
import Inputs from '../Filters/Inputs';
import Form from '../UI/Form';
import { formValidator } from 'src/helpers/formValidator';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import useApi from 'src/hooks/useApi';

const PricingModal = ({
  isOpen,
  toggle,
  initialData = {
    unitId: '',
    unitPrice: '',
    discount: '',
    freeQuota: '',
  },
  networkData,
  getPricing,
}) => {
  const user = useSelector((state) => state.user);
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();

  const { postData, loading } = useApi('/Admin/updatebundlingdetail');

  const [pricingData, setPricingData] = useState(initialData);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (isOpen) {
      setPricingData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPricingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    formValidator();
    const form = document.querySelector('.pricing-form');

    if (!form.checkValidity()) {
      return;
    }

    if (parseFloat(pricingData?.discount) > parseFloat(pricingData?.unitPrice)) {
      showToast('Discount can not be greater then price', 'warning');
      return;
    }

    const submissionData = {
      id: parseInt(networkData?.id?.split('-')[0]),
      startTime: dayjs().utc(networkData?.startTime).format(),
      name: '',
      unitId: parseInt(pricingData?.unitId || '0'),
      unitName:
        globalutil.campaignunits()?.find((u) => u.id === parseInt(pricingData?.unitId))?.name || '',
      unitPrice: Number(pricingData.unitPrice),
      discount: pricingData.discount ? Number(pricingData.discount) : 0,
      freeAllowed: pricingData.freeQuota ? Number(pricingData.freeQuota) : 0,
      lastUpdatedAt: dayjs().utc().format(),
      lastUpdatedBy: user?.userId || 1,
      networkId: networkData?.networkId,
      tax: networkData?.tax || 0,
      purchasedQouta: networkData?.purchasedQouta || 0,
      usedQuota: networkData?.usedQuota || 0,
      autoReplyAllowed: networkData?.autoReplyAllowed || 0,
      hashTags: networkData?.hashTags || '',
      currentApplied: networkData?.currentApplied || 1,
      virtualAccount: networkData?.virtualAccount || 1,
      bundlingAllowed: networkData?.bundlingAllowed || 1,
      createdBy: networkData?.createdBy || user?.userId,
      createdAt: networkData?.createdAt || dayjs().utc().format(),
      finishTime: dayjs().utc(networkData?.finishTime).format(),
      approvalTime: networkData?.approvalTime,
      status: 1,
      rowVer: 1,
    };
    console.log({ submissionData });
    console.log({ submissionData: JSON.stringify(submissionData) });
    const res = await postData(submissionData);
    console.log({ res });
    if (res) {
      if (res?.status) {
        getPricing();
        showToast(res?.message, 'success');
        handleClose();
      } else {
        showToast(res?.message || 'Error updating pricing, try again later', 'error');
      }
    }
  };

  const handleClose = () => {
    setPricingData(initialData);
    setErrors({});
    toggle();
  };

  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel? All changes will be lost.',
      isOpen: true,
      onYes: () => {
        showConfirmation({ isOpen: false });
        handleClose();
      },
      onNo: () => showConfirmation({ isOpen: false }),
    });
  };

  const inputFields = [
    {
      component: CustomSelectInput,
      label: 'Unit',
      icon: cilInfo,
      id: 'unitId',
      options: globalutil.campaignunits(),
      className: 'form-control item form-select',
      value: pricingData.unitId,
      name: 'unitId',
      onChange: handleInputChange,
      isRequired: true,
      disableOption: 'Select Unit',
      message: errors.unitId || 'Please select a unit',
      disabled: pricingData.unitId,
    },
    {
      component: CustomInput,
      label: 'Unit Price',
      value: pricingData.unitPrice,
      onChange: handleInputChange,
      icon: cilDollar,
      type: 'number',
      id: 'unitPrice',
      name: 'unitPrice',
      placeholder: 'Enter unit price',
      className: 'form-control item',
      isRequired: true,
      message: errors.unitPrice || 'Please enter unit price',
      disabled: loading,
    },
    {
      component: CustomInput,
      label: 'Discount',
      value: pricingData.discount,
      onChange: handleInputChange,
      icon: cilTag,
      type: 'number',
      id: 'discount',
      name: 'discount',
      placeholder: 'Enter discount (optional)',
      className: 'form-control item',
      message: errors.discount,
      disabled: loading,
    },
    {
      component: CustomInput,
      label: 'Free Quota',
      value: pricingData.freeQuota,
      onChange: handleInputChange,
      icon: cilGift,
      type: 'number',
      id: 'freeQuota',
      name: 'freeQuota',
      placeholder: 'Enter free quota (optional)',
      className: 'form-control item',
      message: errors.freeQuota,
      disabled: loading,
    },
  ];

  const calculateFinalPrice = () => {
    const price = Number(pricingData.unitPrice) || 0;
    const discount = Number(pricingData.discount) || 0;
    return price - discount;
  };
  //   console.log(networkData);
  return (
    <CModal
      visible={isOpen}
      alignment="center"
      aria-labelledby="pricing-modal"
      aria-describedby="pricing-modal-full-view"
      backdrop="static"
      className="pricing-modal"
      size="lg"
    >
      <Form name="pricing-form">
        <CModalHeader closeButton={false}>
          <CModalTitle className="text-uppercase">
            {networkData?.networkName} Pricing Configuration
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <Inputs inputFields={inputFields} isBtn={false} />

          {/* {pricingData.unitPrice && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="mb-2">Price Summary</h6>
              <div className="d-flex justify-content-between">
                <span>Unit Price:</span>
                <span className="fw-bold">${Number(pricingData.unitPrice).toFixed(2)}</span>
              </div>
              {pricingData.discount && (
                <div className="d-flex justify-content-between text-danger">
                  <span>Discount:</span>
                  <span>-${Number(pricingData.discount).toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Final Price:</span>
                <span className="fw-bold text-success">${calculateFinalPrice().toFixed(2)}</span>
              </div>
              {pricingData.freeQuota && (
                <div className="mt-2 text-muted">
                  <small>Free Quota: {pricingData.freeQuota} units</small>
                </div>
              )}
            </div>
          )} */}
        </CModalBody>

        <CModalFooter>
          <Button title="Cancel" onClick={confirmationModal} disabled={loading} />
          <Button title="Save Pricing" onClick={handleSubmit} type="submit" loading={loading} />
        </CModalFooter>
      </Form>
    </CModal>
  );
};

export default PricingModal;
