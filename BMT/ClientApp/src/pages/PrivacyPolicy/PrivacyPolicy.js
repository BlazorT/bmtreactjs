/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from 'react';
import Loading from 'src/components/UI/Loading'; // your existing loader component

const PrivacyPolicy = () => {
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
        <div className="show-stock">
          <div className="row">
            <div className="login-form" id="printTermsOfUse">
              <h2 className="labelName">Privacy Policy</h2>
              <div className="BodyDivPadding">
                <strong className="TROUSStrong">Vehicle-share Guidelines and Privacy Policy</strong>
                <p className="TROUSParagraph">
                  Blazor Media Toolkit is created in the spirit of peaceful civic engagement. We do
                  not permit the use of bigoted language, anti-government or anti-law enforcement
                  rhetoric or the provocation of violence of any kind. BMT bears no tolerance for
                  objectionable content or abusive users. We reserve the right to not post any
                  vehicle that we deem inappropriate or subversive to the spirit of our platform.
                </p>

                <strong className="TROUSStrong underline">Do not</strong>
                <strong className="TROUSStrong"> post, upload, stream, or share:</strong>
                <ul>
                  <li>
                    <p className="TROUSParagraph">
                      Content that boasts, praise or promotes past, present, or future crimes
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Unnecessary graphic details of crimes</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Yours or anyone else’s’ legal paperwork including court documents, victim
                      documents or official documents from government agencies
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Admissions of guilt for crimes you have not been convicted of
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Names of individuals other than yourself or the loved one you are speaking on
                      behalf of
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Individual personal addresses of you or anyone else
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Names of victims, co-defendants, witnessed or perpetrators nor names of
                      specific correctional officers
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Content that encourages aggressive / angry words or actions directed at public
                      officials, officers of the court, correctional officers, judges or any
                      employee of the state
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Gang names, symbols, flags, logos or gestures</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Content that ridicules victims or their families
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Firearms or weapons of any kind including ammunition and / or accessories
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Content that depicts or promotes the usage of drugs, and or alcohol
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Content that solicits money or financial assistance for you, your loved one or
                      any one at all
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Content that expresses, insinuates, or hints at the guilt of non-convicted
                      citizens
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Explicit language</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Violent threats against any individual or entity of any kind
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Nudity or obscenity</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Content that equates to conspiracy theories</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Misinformation, lies or half-truths</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">Personal medical records of you or anyone else</p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Personal identity information such as bank account information, bank
                      statements, social security numbers and/or card, drivers license or any other
                      sensitive content of similar nature
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Personal login codes, names or passwords for you or anyone else
                    </p>
                  </li>
                  <li>
                    <p className="TROUSParagraph">
                      Content that violates or infringes on someone else’s legally held copyright,
                      trademark, intellectual property or patten
                    </p>
                  </li>
                </ul>

                <strong className="TROUSStrong pt-2">Content Integrity</strong>
                <ul>
                  <p className="TROUSParagraph">
                    BMT expects every vehicle-share to contain authentic stories of truthfulness and
                    honesty without lies fabrications or exaggerations.
                  </p>
                </ul>
                <ul>
                  <p className="TROUSParagraph">
                    BMT is not responsible for stories or details within a story that may turn out
                    to be falsified by the vehicle-share.
                  </p>
                </ul>
                <ul>
                  <p className="TROUSParagraph">
                    BMT reserves the right to inquire with family, friends, law enforcement and
                    policymakers about the truthfulness of your story including generalizations and
                    / or details pertaining to people, places, things, and situations. We understand
                    that situational evidence is subjective and that there may be numerous views and
                    opinions about the same incident. If however, BMT discovers that any part of
                    your story is false, your account will be suspended and your vehicle removed
                    permanently.
                  </p>
                </ul>
                <p className="TROUSParagraph pt-2">
                  <strong className="TROUSStrong">Last Updated:</strong> December 5, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
