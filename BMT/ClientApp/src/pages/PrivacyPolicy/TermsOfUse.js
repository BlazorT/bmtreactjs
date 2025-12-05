/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from 'react';
import Loading from 'src/components/UI/Loading'; // your existing loader component

const TermsOfUse = () => {
 const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure loader shows immediately and then content renders
    setLoading(true);

    // simulate a small delay for loading if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // you can adjust this to 0 if no delay needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />; // Loader shows immediately
  }


  return (
    <div className="job-application-form">
      <div className="bg_Div mt-2 d-flex flex-column">
        <div className="login-form PrintForm" id="printTermsOfUse">
          <h1 className="ModelTitle">Terms of Use</h1>
          <div>
            <p className="TROUSParagraph">
              By using our site, you agree to the terms of use and agree to follow and be bound by these terms.
            </p>
            <p className="TROUSParagraph">
              Please allow 3 business days for order processing and payment verification. Please allow 2-4 weeks for us to process your order. Thanks for your patience and support.
            </p>
            <p className="TROUSParagraph">
              <strong className="TROUSStrong">COPYRIGHT & TRADEMARKS</strong>
              <br></br>Materials, images, illustrations, designs, icons, etc. are all copy written and trademarked under legal authority of Blazor Media Toolkit LLC.
            </p>
            <p className="TROUSParagraph">
              <strong className="TROUSStrong">CORRECTION OF ERRORS & INACCURACIES:</strong>
              <br></br>Information on this site may contain typographical errors or inaccuracies, some information may not be complete or current. The Blazor Media Toolkit (BMT) reserves the right to correct errors, inaccuracies, and to change or update information any time with out notice (Including after you’ve submitted your order.)
            </p>
            <p className="TROUSParagraph pt-2"><strong className="TROUSStrong">Last Updated:</strong> December 5, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
