/* eslint-disable react/prop-types */
import { CCol, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { useSelector } from 'react-redux';
import { cilGlobe, cilFilter, cilClock } from '@coreui/icons';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';
import Form from '../UI/Form';
import CustomInput from '../InputsComponent/CustomInput';
import Button from '../UI/Button';
import { formValidator } from 'src/helpers/formValidator';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const CrawlDomainsModal = ({ isOpen, toggle, onCrawlComplete }) => {
  const user = useSelector((state) => state.user);
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

  useEffect(() => {
    if (!isOpen) {
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

    // Convert URLs string to array
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

  return (
    <Modal isOpen={isOpen} size="xl" centered>
      <Form name="crawl-form">
        <ModalHeader toggle={confirmationModal}>Crawl Domains for Contacts</ModalHeader>
        <ModalBody className="paddingAllSide">
          <CRow>
            <CCol md="12">
              <div className="mb-3">
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
                icon={cilGlobe}
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
                icon={cilGlobe}
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

          {/* Results Display */}
          {crawlResults && (
            <CRow className="mt-4">
              <CCol md="12">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Crawl Results</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
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

                    {crawlResults.appliedFilters && (
                      <div className="mt-3">
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
                    <div className="mt-3">
                      <strong>Details by Domain:</strong>
                      {crawlResults.results.map((result, index) => (
                        <div key={index} className="border-top pt-2 mt-2">
                          <p className="mb-1">
                            <strong>{result.domain}</strong> - {result.pagesCrawled} pages
                          </p>
                          <p className="mb-0 text-muted small">
                            Emails: {result.emails.length} | Phones: {result.phones.length} |
                            WhatsApp: {result.whatsapp.length}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CCol>
            </CRow>
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
