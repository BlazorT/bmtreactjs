import React from 'react';
import { useNavigate } from 'react-router-dom';
function AppFooter() {
  const navigate = useNavigate();
  return (
    <div className="BottomView">
      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={() => navigate('/dspRegister')}>
            Register DSP
          </a>
        </div>
        <div className="col-md-4 order3">
          <img className="PlaySoreIcon" src="AppStore.png" alt="logo" />
          <img className="PlaySoreIcon" src="GooglePlaystore.png" alt="logo" />
        </div>
        <div className="col-md-4 order2">
          <a className="labelName pointer">Contact Us</a>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer" onClick={() => navigate('/AddDA')}>
            Apply for Delivery Associate
          </a>
        </div>
        <div className="col-md-4 order3">
          <img className="socialMediaIcon" src="instagram.png" alt="logo" />
          <img className="socialMediaIcon" src="twitter.png" alt="logo" />
          <img className="socialMediaIcon" src="facebook.png" alt="logo" />
        </div>
        <div className="col-md-4 order2">
          <a className="labelName pointer">Policy Statement</a>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 order1">
          <a className="labelName pointer">FAQs</a>
        </div>
        <div className="col-md-4 order3">
          <span className="market-button-subtitle labelName">
            © 2023, 6BY7. All Rights Reserved
          </span>
        </div>
        <div className="col-md-4 order2">
          <a className="labelName pointer">Terms of Use</a>
        </div>
      </div>
    </div>
  );
}
export default AppFooter;
