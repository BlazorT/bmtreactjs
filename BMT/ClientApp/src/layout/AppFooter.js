
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import ContactUs from 'src/components/Modals/ContactUs';
import TermOfUse from 'src/components/Modals/TermOfUse';

function AppFooter() {
  const navigate = useNavigate();
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [contactUsmodalOpen, setContactUsmodalOpen] = useState(false);
  const [termOfUsemodalOpen, setTermOfUsemodalOpen] = useState(false);
  const TermsModal = () => {
    setTermsmodalOpen((prev) => !prev);
  };
  const ContactModal = () => {
    setContactUsmodalOpen((prev) => !prev);
  };
  const TermOfUseModal = () => {
    setTermOfUsemodalOpen((prev) => !prev);
  };
  return (
    <div className="BottomView">
      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={ContactModal}>Contact Us</a>
        </div>
        <div className="col-md-4 order3">
          <img className="PlaySoreIcon" src="AppStore.png" alt="logo" />
          <img className="PlaySoreIcon" src="GooglePlaystore.png" alt="logo" />
        </div>
        <div className="col-md-4 order2">
          <a className="labelName pointer" onClick={TermsModal}>Policy Statement</a>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={TermOfUseModal}>Terms of Use</a>
        </div>
        <div className="col-md-4 order3 mt-2">
          <img className="socialMediaIcon" src="instagram.png" alt="logo" />
          <img className="socialMediaIcon" src="twitter.png" alt="logo" />
          <img className="socialMediaIcon" src="facebook.png" alt="logo" />
        </div>
        <div className="col-md-4 order2">
          <a className="labelName pointer">FAQs</a>
        </div>
      </div>
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
      <ContactUs isOpen={contactUsmodalOpen} toggle={ContactModal} />
      <TermOfUse isOpen={termOfUsemodalOpen} toggle={TermOfUseModal} />

    </div>
  );
}
export default AppFooter;
