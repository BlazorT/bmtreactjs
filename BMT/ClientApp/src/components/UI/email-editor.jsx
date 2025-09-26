import React, { useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import Button from '../InputsComponent/Button';
import CIcon from '@coreui/icons-react';
import { cilFullscreen, cilFullscreenExit } from '@coreui/icons';
import { htmlToStructuredDesign } from 'src/helpers/emailJson';

// eslint-disable-next-line react/prop-types
const EmailTextEditor = ({ open, toggle, onSave, value, isModal = true }) => {
  const emailEditorRef = useRef(null);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    return new Promise((resolve) => {
      unlayer?.exportHtml((data) => {
        const { design, html } = data;
        resolve({ design, html });
      });
    });
  };

  const onReady = (unlayer) => {
    unlayer.setBodyValues({ contentWidth: '100%', backgroundColor: 'TRANSPARENT' });
    unlayer.addEventListener('design:updated', () => {
      unlayer.setBodyValues({ contentWidth: '100%', backgroundColor: 'TRANSPARENT' });
    });

    // Load existing design if available
    if (value) {
      const converter = htmlToStructuredDesign;
      const convertedDesign = converter(value);

      if (convertedDesign) {
        unlayer.loadDesign(convertedDesign);
      }
    }
  };

  const handleSave = async () => {
    const { design, html } = await exportHtml();
    onSave(html, design);
    toggle?.(); // only call toggle if passed
  };

  const handleClose = () => {
    toggle?.();
  };

  /** ────────────── MODAL MODE ────────────── **/
  if (isModal) {
    if (!open) return null;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-backdrop" onClick={handleClose}></div>
        <div className="custom-modal-email">
          <div className="custom-modal-body">
            <EmailEditor ref={emailEditorRef} onReady={onReady} minHeight={'100%'} />
          </div>
          <div className="custom-modal-footer">
            <button className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  /** ────────────── INLINE MODE ────────────── **/
  return (
    <div className={`email-editor-container ${isEnlarged ? 'enlarged' : ''}`}>
      <div className="email-editor-header">
        <CIcon
          icon={!isEnlarged ? cilFullscreen : cilFullscreenExit}
          onClick={() => setIsEnlarged((prev) => !prev)}
          className="stock-toggle-icon"
        />
        {/* <Button
          title={isEnlarged ? 'Shrink' : 'Enlarge'}
          onClick={() => setIsEnlarged((prev) => !prev)}
        /> */}
      </div>
      <div className="email-editor-body">
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          minHeight={isEnlarged ? '90vh' : '500px'}
        />
      </div>
      <div className="email-editor-footer">
        <Button
          title={'Save'}
          onClick={() => {
            if (isEnlarged) {
              setIsEnlarged(false);
            }
            handleSave();
          }}
        />
      </div>
    </div>
  );
};

export default EmailTextEditor;
