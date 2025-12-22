import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import ContactUs from 'src/components/Modals/ContactUs';
import Unsubscribe from 'src/components/Modals/Unsubscribe';
import TermOfUse from 'src/components/Modals/TermOfUse';

function AppFooter() {
  const navigate = useNavigate();
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [contactUsmodalOpen, setContactUsmodalOpen] = useState(false);
  const [UnsubscribeModalOpen, setUnsubscribeModalOpen] = useState(false);
  const [termOfUsemodalOpen, setTermOfUsemodalOpen] = useState(false);
  const TermsModal = () => {
    setTermsmodalOpen((prev) => !prev);
  };
  const ContactModal = () => {
    setContactUsmodalOpen((prev) => !prev);
  };
  const UnsubscribeModal = () => {
    setUnsubscribeModalOpen((prev) => !prev);
  };
  const TermOfUseModal = () => {
    setTermOfUsemodalOpen((prev) => !prev);
  };
  return (
    <div className="BottomView">
      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={ContactModal}>
            Contact Us
          </a>
        </div>
        <div className="col-md-4 order3">
          <a
            href="https://apps.apple.com/us/app/blazor-media-toolkit/id6756116785"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="PlayStoreIcon appleIcon" src="AppStore.png" alt="Blazor Media Toolkit on App Store" />
          </a>
          <img className="PlaySoreIcon" src="GooglePlaystore.png" alt="logo" />
        </div>
        <div className="col-md-4 order2">
          {/*<a className="labelName pointer"   target="_blank" onClick={TermsModal}>*/}
          {/*  Policy Statement*/}
          {/*</a>*/}
          <a
            className="labelName pointer"
            href="/privacypolicy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Policy Statement
          </a>

        </div>
      </div>

      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={() => navigate('/add-org')}>
            Register Organization
          </a>
        </div>
       
        <div className="col-md-4 order3 mt-2">
          <img className="socialMediaIcon" src="insta-removebg-preview.png" alt="logo" />
          <img className="socialMediaIcon" src="twitter.png" alt="logo" />
          <img className="socialMediaIcon" src="facebook.png" alt="logo" />
        </div>

        <div className="col-md-4 order2">
          {/*<a className="labelName pointer" onClick={TermOfUseModal}>*/}
          {/*  Terms of Use*/}
          {/*</a>*/}
          <a
            className="labelName pointer"
            href="/TermsOfUse"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          {/* <a className="labelName pointer">FAQs</a> */}
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={UnsubscribeModal}>
            Account Closed ?
          </a>
        </div>
      </div>
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
      <ContactUs isOpen={contactUsmodalOpen} toggle={ContactModal} />
      <Unsubscribe isOpen={UnsubscribeModalOpen} toggle={UnsubscribeModal} />
      <TermOfUse isOpen={termOfUsemodalOpen} toggle={TermOfUseModal} />
    </div>
  );
}
export default AppFooter;
