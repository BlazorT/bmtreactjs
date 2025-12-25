/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilChevronBottom, cilClock, cilFilter, cilGlobeAlt, cilInfo } from '@coreui/icons';
import { CCol, CRow, CTooltip } from '@coreui/react';
import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { formValidator } from 'src/helpers/formValidator';
import useApi from 'src/hooks/useApi';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import CustomInput from '../InputsComponent/CustomInput';
import Button from '../UI/Button';
import Form from '../UI/Form';
import ImportContactsGrid from '../MailImports/ImportContactsGrid';
import DataGridHeader from '../DataGridComponents/DataGridHeader';
import AppContainer from '../UI/AppContainer';
import CIcon from '@coreui/icons-react';

const CrawlDomainsModal = ({
  isOpen,
  toggle,
  onCrawlComplete,
  recipientsList,
  getRecipientList,
}) => {
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

  const { loading, postData } = useApi(process.env.REACT_APP_BMT_SERVIVE + '/api/crawl-domains');

  const defaultCrawlData = {
    urls: '',
    maxDepth: 3,
    maxPagesPerDomain: 25,
    delayMs: 1000,
    respectRobotsTxt: true,
    filterCountry: '',
    filterCity: '',
  };

  const [crawlData, setCrawlData] = useState(defaultCrawlData);
  const [crawlResults, setCrawlResults] = useState(null);
  const [showCrawlInfo, setShowCrawlInfo] = useState(true);

  const toggleCrawlInfo = () => {
    setShowCrawlInfo((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowCrawlInfo(true);
      setCrawlResults(null);
    }
  }, [isOpen]);

  const handleCrawlData = (e) => {
    const { name, value, type, checked } = e.target;
    setCrawlData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSubmit = async () => {
    formValidator();
    const form = document.querySelector('.crawl-form');

    if (!form.checkValidity()) {
      return;
    }

    const urlsArray = crawlData.urls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urlsArray.length === 0) {
      showToast('Please enter at least one URL', 'error');
      return;
    }

    if (urlsArray.length > 10) {
      showToast('Maximum 10 URLs allowed', 'error');
      return;
    }

    const payload = {
      urls: urlsArray,
      maxDepth: parseInt(crawlData.maxDepth),
      maxPagesPerDomain: parseInt(crawlData.maxPagesPerDomain),
      delayMs: parseInt(crawlData.delayMs),
      respectRobotsTxt: crawlData.respectRobotsTxt,
      filterCountry: crawlData.filterCountry || undefined,
      filterCity: crawlData.filterCity || undefined,
    };

    setCrawlResults(null);
    console.log({ payload });
    const res = await postData(payload);
    console.log({ res });

    if (res && res?.status === 'completed') {
      showToast(
        `Crawl completed! Found ${res.summary.totalContactsFound} contacts from ${res.summary.pagesCrawled} pages`,
        'success',
      );
      setCrawlResults(res);
      onCrawlComplete?.(res);
      if (showCrawlInfo) toggleCrawlInfo();
    } else if (res && res?.status === 'aborted') {
      showToast('Crawl was aborted', 'warning');
    } else {
      showToast(res?.error || 'Something went wrong, try again later', 'error');
    }
  };

  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onClose(),
      onNo: () =>
        showConfirmation({
          isOpen: false,
        }),
    });
  };

  const onClose = () => {
    showConfirmation({
      isOpen: false,
    });
    setCrawlData(defaultCrawlData);
    setCrawlResults(null);
    toggle();
  };

  const results = crawlResults?.results ?? [];

  // Transform API response to grid format with city data
  const rows = results.flatMap((r) => {
    const emailRows = (r.emails ?? [])
      .filter((e) => e?.value)
      .map((e) => ({
        type: 2,
        content: e.value,
        name: '--',
        country: e?.location?.country?.name || '--',
        countryCode: e?.location?.country?.code || '',
        countryConfidence: e?.location?.country?.confidence || '',
        city: e?.location?.city || '--',
        cityMatches: e?.location?.cityMatches || [],
        source: e?.sourceUrls?.[0] || '--',
      }));

    const contactRows = [...(r.phones ?? []), ...(r.whatsapp ?? [])]
      .filter((c) => c?.value)
      .map((c) => ({
        type: 1,
        content: c.value,
        name: '--',
        country: c?.location?.country?.name || '--',
        countryCode: c?.location?.country?.code || '',
        countryConfidence: c?.location?.country?.confidence || '',
        city: c?.location?.city || '--',
        cityMatches: c?.location?.cityMatches || [],
        source: c?.sourceUrls?.[0] || '--',
      }));

    return [...emailRows, ...contactRows];
  });

  // Calculate city detection statistics
  const cityStats = {
    totalContacts: rows.length,
    withCity: rows.filter((r) => r.city && r.city !== '--').length,
    highConfidence: rows.filter((r) => r.cityMatches?.some((m) => m.confidence === 'high')).length,
    mediumConfidence: rows.filter(
      (r) =>
        r.cityMatches?.some((m) => m.confidence === 'medium') &&
        !r.cityMatches?.some((m) => m.confidence === 'high'),
    ).length,
    withAlternatives: rows.filter((r) => r.cityMatches?.length > 1).length,
  };

  return (
    <Modal isOpen={isOpen} size="xl" centered>
      <Form name="crawl-form">
        <ModalHeader toggle={confirmationModal}>Crawl Domains for Contacts</ModalHeader>
        <ModalBody className="crawl-modal-body">
          <AppContainer className="mt-0 px-3 rounded-3">
            <DataGridHeader
              title="Crawl Data"
              onClick={toggleCrawlInfo}
              otherControls={[{ icon: cilChevronBottom, fn: toggleCrawlInfo }]}
              filterDisable={true}
              className="fs-5"
            />
            {showCrawlInfo && (
              <div>
                <CRow>
                  <CCol md="12">
                    <div className="mb-0">
                      <label className="form-label">
                        URLs to Crawl <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        name="urls"
                        value={crawlData.urls}
                        onChange={handleCrawlData}
                        placeholder="Enter URLs (one per line, max 10)&#10;Example:&#10;https://example.com&#10;https://another-site.com"
                        required
                        disabled={loading}
                      />
                      <small className="text-muted">Enter one URL per line (max 10 URLs)</small>
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="4">
                    <CustomInput
                      label="Max Depth"
                      value={crawlData.maxDepth}
                      onChange={handleCrawlData}
                      icon={cilGlobeAlt}
                      id="maxDepth"
                      name="maxDepth"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="3"
                      className="form-control item"
                      isRequired
                      disabled={loading}
                      message="Enter max depth (1-50)"
                    />
                  </CCol>
                  <CCol md="4">
                    <CustomInput
                      label="Max Pages Per Domain"
                      value={crawlData.maxPagesPerDomain}
                      onChange={handleCrawlData}
                      icon={cilGlobeAlt}
                      id="maxPagesPerDomain"
                      name="maxPagesPerDomain"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="25"
                      className="form-control item"
                      isRequired
                      disabled={loading}
                      message="Enter max pages (1-50)"
                    />
                  </CCol>
                  <CCol md="4">
                    <CustomInput
                      label="Delay (ms)"
                      value={crawlData.delayMs}
                      onChange={handleCrawlData}
                      icon={cilClock}
                      id="delayMs"
                      name="delayMs"
                      type="number"
                      min="100"
                      placeholder="1000"
                      className="form-control item"
                      isRequired
                      disabled={loading}
                      message="Enter delay in milliseconds (min 100)"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="6">
                    <CustomInput
                      label="Filter by Country"
                      value={crawlData.filterCountry}
                      onChange={handleCrawlData}
                      icon={cilFilter}
                      id="filterCountry"
                      name="filterCountry"
                      placeholder="e.g., USA, Pakistan"
                      className="form-control item"
                      isRequired={false}
                      disabled={loading}
                    />
                  </CCol>
                  <CCol md="6">
                    <CustomInput
                      label="Filter by City"
                      value={crawlData.filterCity}
                      onChange={handleCrawlData}
                      icon={cilFilter}
                      id="filterCity"
                      name="filterCity"
                      placeholder="e.g., Lahore, New York"
                      className="form-control item"
                      isRequired={false}
                      disabled={loading}
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="12">
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="respectRobotsTxt"
                        name="respectRobotsTxt"
                        checked={crawlData.respectRobotsTxt}
                        onChange={handleCrawlData}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="respectRobotsTxt">
                        Respect robots.txt
                      </label>
                    </div>
                  </CCol>
                </CRow>
              </div>
            )}
          </AppContainer>

          {/* Results Display */}
          {crawlResults && (
            <>
              <CRow className="mt-2">
                <CCol md="12">
                  <div className="card border-0">
                    <div className="card-header rdg-header-row text-white">
                      <h5 className="mb-0 fw-bold">Crawl Results</h5>
                    </div>
                    <div className="card-body rounded-0 input-bg">
                      {/* Summary Row */}
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>Domains Processed:</strong>
                          <p className="mb-0">{crawlResults.summary.domainsProcessed}</p>
                        </div>
                        <div className="col-md-3">
                          <strong>Pages Crawled:</strong>
                          <p className="mb-0">{crawlResults.summary.pagesCrawled}</p>
                        </div>
                        <div className="col-md-3">
                          <strong>Contacts Found:</strong>
                          <p className="mb-0">{crawlResults.summary.totalContactsFound}</p>
                        </div>
                        <div className="col-md-3">
                          <strong>Duration:</strong>
                          <p className="mb-0">
                            {(crawlResults.summary.durationMs / 1000).toFixed(2)}s
                          </p>
                        </div>
                      </div>

                      {/* City Detection Statistics */}
                      {cityStats.withCity > 0 && (
                        <div className="row mb-3 border-top pt-3">
                          <div className="col-12 mb-2">
                            <strong className="d-flex align-items-center gap-2">
                              City Detection Statistics
                              <CTooltip content="Shows how many contacts have cities detected and their confidence levels">
                                <CIcon icon={cilInfo} size="sm" className="text-muted" />
                              </CTooltip>
                            </strong>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <span>With City:</span>
                              <span className="badge badge-high-confidence">
                                {cityStats.withCity} / {cityStats.totalContacts}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <span>High Confidence:</span>
                              <span className="badge badge-high-confidence">
                                {cityStats.highConfidence}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <span>Medium Confidence:</span>
                              <span className="badge badge-medium-confidence">
                                {cityStats.mediumConfidence}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <span>With Alternatives:</span>
                              <span className="badge badge-alternative-matches">
                                {cityStats.withAlternatives}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Applied Filters */}
                      {crawlResults.appliedFilters && (
                        <div className="mt-3 border-top pt-3">
                          <strong>Applied Filters:</strong>
                          <p className="mb-0">
                            {crawlResults.appliedFilters.country &&
                              `Country: ${crawlResults.appliedFilters.country} `}
                            {crawlResults.appliedFilters.city &&
                              `City: ${crawlResults.appliedFilters.city}`}
                          </p>
                        </div>
                      )}

                      {/* Detailed Results by Domain */}
                      <div className="mt-3 border-top pt-3">
                        <strong>Details by Domain:</strong>
                        {crawlResults.results.map((result, index) => {
                          const domainCityCount = [
                            ...result.emails,
                            ...result.phones,
                            ...result.whatsapp,
                          ].filter((c) => c?.location?.city).length;

                          return (
                            <div key={index} className="border-top pt-2 mt-2">
                              <p className="mb-1">
                                <strong>{result.domain}</strong> - {result.pagesCrawled} pages
                                {result.country && (
                                  <span className="ms-2 text-muted">({result.country.name})</span>
                                )}
                              </p>
                              <div className="d-flex gap-3">
                                <p className="mb-0 text-muted small">
                                  Emails: {result.emails.length} | Phones: {result.phones.length} |
                                  WhatsApp: {result.whatsapp.length}
                                </p>
                                {domainCityCount > 0 && (
                                  <p className="mb-0 small">
                                    <span className="badge badge-high-confidence">
                                      {domainCityCount} with city
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>

              {/* Contact Grid */}
              {rows?.length > 0 && (
                <CCol md="12">
                  <ImportContactsGrid
                    data={rows}
                    getRecipientList={getRecipientList}
                    recipientsList={recipientsList}
                    isShowCountry
                  />
                </CCol>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button title="Cancel" disabled={loading} onClick={confirmationModal} />
          <Button
            title="Start Crawl"
            disabled={loading}
            type="submit"
            loading={loading}
            loadingTitle="Crawling..."
            onClick={onSubmit}
          />
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CrawlDomainsModal;
