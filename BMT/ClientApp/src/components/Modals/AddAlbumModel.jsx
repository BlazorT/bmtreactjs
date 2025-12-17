/* eslint-disable react/prop-types */
import { CCol, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { cilFlagAlt } from '@coreui/icons';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';
import Form from '../UI/Form';
import CustomInput from '../InputsComponent/CustomInput';
import Button from '../UI/Button';
import { formValidator } from 'src/helpers/formValidator';
import { useShowToast } from 'src/hooks/useShowToast';

const AddAlbumModel = ({ isOpen, toggle, networkId, refreshRecipients }) => {
  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  const { loading, postData } = useApi('/Compaigns/submitalbumlist');

  const defaultAlbumData = {
    id: 0,
    networkid: 0,
    name: '',
    code: '',
    desc: '',
    lastUpdatedBy: user?.userId,
    orgid: user?.orgId,
    lastUpdatedAt: dayjs().utc().format(),
    rowVer: 1,
    status: 1,
  };

  const [albumData, setAlbumData] = useState(defaultAlbumData);

  useEffect(() => {
    if (!isOpen) return;
    if (!networkId) return;
    setAlbumData((prev) => ({ ...prev, networkid: networkId }));
  }, [isOpen, networkId]);

  const handleAlbumData = (e) => {
    const { name, value } = e.target;
    setAlbumData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    formValidator();
    const form = document.querySelector('.album-form');

    if (!form.checkValidity()) {
      return;
    }
    console.log({ albumData });
    const res = await postData({ ...albumData, networkid: parseInt(albumData?.networkid) });
    console.log({ res });
    if (res && res?.status) {
      showToast(
        res?.message || `Album ${albumData?.name} has been submitted successfully`,
        'success',
      );
      toggle();
      refreshRecipients?.();
      setAlbumData(defaultAlbumData);
    } else {
      showToast(res?.message || `Something went wrong, try again later`, 'error');
    }
  };
  return (
    <Modal isOpen={isOpen} size="lg" centered>
      <Form name="album-form">
        <ModalHeader toggle={toggle}>Add Album</ModalHeader>
        <ModalBody className="paddingAllSide">
          <CRow>
            <CCol md="6">
              <CustomSelectInput
                label="Network"
                icon={cilFlagAlt}
                disabled={loading || !!networkId}
                disableOption="Select Network"
                id="networkid"
                options={globalutil.networks()}
                className="form-control item form-select scheduleClass"
                value={albumData.networkid}
                name="networkid"
                isRequired
                title=" Select Network "
                onChange={handleAlbumData}
                message="Select Network"
              />
            </CCol>
            <CCol md="6">
              <CustomInput
                label="Album Name"
                value={albumData.name}
                onChange={handleAlbumData}
                icon={cilFlagAlt}
                id="name"
                name="name"
                placeholder="name"
                className="form-control item"
                isRequired
                disabled={loading}
                message="Enter album name"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md="6">
              <CustomInput
                label="Album Code"
                value={albumData.code}
                onChange={handleAlbumData}
                icon={cilFlagAlt}
                id="code"
                name="code"
                placeholder="code"
                className="form-control item"
                isRequired
                disabled={loading}
                message="Enter album code"
              />
            </CCol>
            <CCol md="6">
              <CustomInput
                label="Album Description"
                value={albumData.desc}
                onChange={handleAlbumData}
                icon={cilFlagAlt}
                id="desc"
                name="desc"
                placeholder="desc"
                className="form-control item"
                isRequired={false}
                disabled={loading}
              />
            </CCol>
          </CRow>
        </ModalBody>
        <ModalFooter>
          <Button title="Cancel" disabled={loading} onClick={toggle} />
          <Button
            title="Submit"
            disabled={loading}
            type="submit"
            loading={loading}
            loadingTitle="Submitting..."
            onClick={onSubmit}
          />
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddAlbumModel;
