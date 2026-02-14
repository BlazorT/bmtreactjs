/* eslint-disable react/prop-types */
import { cilCloudUpload, cilLink, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CCol, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import CustomInput from '../InputsComponent/CustomInput';
import Button from '../UI/Button';

dayjs.extend(utc);

const AttachmentManager = ({ attachments, setAttachments, uploadAvatar, userId, showToast }) => {
  const [uploadingStates, setUploadingStates] = React.useState({
    1: false,
    2: false,
    3: false,
  });

  const handleUrlChange = (id, url) => {
    setAttachments((prev) =>
      prev.map((att) => (att.id === id ? { ...att, url, file: null } : att)),
    );
  };

  const handleFileUpload = async (id, file) => {
    if (!file) return;

    const attachment = attachments.find((att) => att.id === id);
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
      pdf: ['application/pdf'],
    };

    const allowed = allowedTypes[attachment.type];
    if (!allowed.includes(file.type)) {
      showToast(
        `Invalid file type for ${attachment.type}. Please upload a valid ${attachment.type} file.`,
        'error',
      );
      return;
    }

    setUploadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', '0');
      formData.append('name', file.name);
      formData.append('fileName', file.name);
      formData.append('createdBy', userId || 1);
      formData.append('createdAt', dayjs().utc().format());

      const uploadAvatarRes = await uploadAvatar(formData);

      if (uploadAvatarRes?.status === true) {
        const uploadedPath =
          window.location.origin +
          '/productimages/' +
          uploadAvatarRes.keyValue.toString().split('\\').pop();

        setAttachments((prev) =>
          prev.map((att) =>
            att.id === id
              ? { ...att, url: uploadedPath, file: uploadedPath, fileName: file.name }
              : att,
          ),
        );

        showToast('File uploaded successfully', 'success');
      } else if (uploadAvatarRes?.message) {
        showToast(uploadAvatarRes.message, 'error');
      }
    } catch (error) {
      showToast('Failed to upload file', 'error');
      console.error('Upload error:', error);
    } finally {
      setUploadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleClearAttachment = (id) => {
    setAttachments((prev) =>
      prev.map((att) => (att.id === id ? { ...att, url: '', file: null, fileName: '' } : att)),
    );
  };

  const getAttachmentLabel = (type) => {
    const labels = {
      image: 'Image',
      video: 'Video',
      pdf: 'PDF',
    };
    return labels[type] || type;
  };

  const getAttachmentIcon = (type) => {
    const icons = {
      image: '🖼️',
      video: '🎥',
      pdf: '📄',
    };
    return icons[type] || '📎';
  };

  const getAcceptTypes = (type) => {
    const accepts = {
      image: 'image/*',
      video: 'video/*',
      pdf: '.pdf',
    };
    return accepts[type] || '*';
  };

  const renderPreview = (attachment) => {
    if (!attachment.url) return null;

    if (attachment.type === 'image') {
      return (
        <div className="mt-2">
          <img
            src={attachment.url}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '120px',
              objectFit: 'contain',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    if (attachment.type === 'video') {
      return (
        <div className="mt-2">
          <video
            key={attachment.url}
            src={attachment.url}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '120px',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {/* <CCardHeader className="d-flex justify-content-between align-items-center py-2">
        <h6 className="mb-0 small">Attachments (Max 3)</h6>
        <CBadge color="info">
          <small>{attachments.filter((att) => att.url || att.file).length} / 3</small>
        </CBadge>
      </CCardHeader> */}
      <>
        {attachments.map((attachment) => (
          <div key={attachment.id} className="mb-2 border rounded p-2 bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="mb-0 small">
                <span className="me-1">{getAttachmentIcon(attachment.type)}</span>
                {getAttachmentLabel(attachment.type)}
              </h6>
              {(attachment.url || attachment.file) && (
                <Button
                  title="Clear"
                  icon={<CIcon icon={cilTrash} />}
                  onClick={() => handleClearAttachment(attachment.id)}
                  className="btn-sm btn-danger w-auto px-2"
                />
              )}
            </div>

            {attachment.fileName && (
              <div className="mb-2">
                <CBadge color="success" className="me-1">
                  <small>✓</small>
                </CBadge>
                <small className="text-muted">{attachment.fileName}</small>
              </div>
            )}

            <CRow className="g-2">
              <CCol md={7}>
                <CustomInput
                  type="text"
                  placeholder={`${attachment.type} URL`}
                  value={attachment.url || ''}
                  onChange={(e) => handleUrlChange(attachment.id, e.target.value)}
                  icon={cilLink}
                  width="w-100"
                  disabled={uploadingStates[attachment.id]}
                />
              </CCol>
              <CCol md={5}>
                <div className="position-relative">
                  <input
                    type="file"
                    id={`file-upload-${attachment.id}`}
                    accept={getAcceptTypes(attachment.type)}
                    onChange={(e) => handleFileUpload(attachment.id, e.target.files[0])}
                    className="d-none"
                    disabled={uploadingStates[attachment.id]}
                  />
                  <button
                    type="button"
                    htmlFor={`file-upload-${attachment.id}`}
                    className="btn w-100 gap-2 d-flex align-items-center justify-content-center"
                    style={{
                      cursor: uploadingStates[attachment.id] ? 'not-allowed' : 'pointer',
                      opacity: uploadingStates[attachment.id] ? 0.6 : 1,
                    }}
                  >
                    <CIcon icon={cilCloudUpload} size="sm" />
                    <small>{uploadingStates[attachment.id] ? 'Uploading...' : 'Upload'}</small>
                  </button>
                </div>
              </CCol>
            </CRow>

            {/* Preview */}
            {renderPreview(attachment)}

            {attachment.url && !attachment.fileName && attachment.type === 'pdf' && (
              <div className="mt-2">
                <small className="text-success">
                  <CIcon icon={cilLink} className="me-1" />
                  PDF URL provided
                </small>
              </div>
            )}
          </div>
        ))}

        <small className="text-muted d-block mt-2" style={{ fontSize: '0.7rem' }}>
          <strong>Supported:</strong> Image (JPEG, PNG, GIF, WebP) • Video (MP4, MPEG, QuickTime,
          AVI) • PDF
        </small>
      </>
    </div>
  );
};

export default AttachmentManager;
