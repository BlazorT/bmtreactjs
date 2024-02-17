/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import AddInspectionModal from '../Modals/AddInspectionModal';
import { CCol, CRow } from '@coreui/react';

import globalutil from 'src/util/globalutil';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import { getInspectionPdf } from 'src/helpers/getInspectionPdf';
import LoadingBtn from '../UI/LoadingBtn';

const InspectionReportCell = ({ reportField, fetchInspection, rows, value }) => {
  const [isInspReMdlOpen, setIsInspRepMdlOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchData: getReportData } = useFetch();

  const dispatch = useDispatch();

  const generatePdf = async () => {
    setIsLoading(true);
    const body = {
      id: reportField[0].id,
    };

    //
    await getReportData(
      '/Vehicles/inspectionswithitems',
      { method: 'POST', body: JSON.stringify(body) },
      (res) => {
        if (res.status) {
          const initialArray = res.data.inspectionItems.map((field) => ({
            desc: globalutil.inspectionitems().find((item) => item.id == field.inspectionItemId)
              .desc,
            name: globalutil.inspectionitems().find((item) => item.id == field.inspectionItemId)
              .name,
            remarks: field.remarks,
            found: field.found,
          }));

          const reportRows = makeGroupingRows(initialArray);
          const doc = getInspectionPdf(reportRows, reportField);
          doc.output('dataurlnewwindow');
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
        }
        setIsLoading(false);
      },
    );
  };

  const makeGroupingRows = (data) => {
    const updatedData = [];
    const uniqueDescValues = [...new Set(data.map((item) => item.desc))];

    uniqueDescValues.forEach((uniqueDesc) => {
      const id = Math.floor(Math.random() * 900) + 100; // Replace this with your actual parent name
      const group = uniqueDesc;

      updatedData.push({ group, id });

      data
        .filter((item) => item.desc === uniqueDesc)
        .forEach((item) => {
          updatedData.push(item);
        });
    });
    const mappedArray = updatedData.map((field) => {
      let mappedObject;

      if (field.group) {
        mappedObject = {
          group: field.group,
        };
      } else {
        mappedObject = {
          itemName: field.name,
          found: field.found ? field.found : 0,
          remarks: field.remarks ? field.remarks : '',
        };
      }

      return mappedObject;
    });
    return mappedArray.flatMap((item, index) => {
      if (item.group) {
        const group = [item.group, '', ''];
        const headerRow = ['Part and Accessories', 'Defects', '4'];
        return [group, headerRow];
      } else {
        const rowData = [item.itemName, item.remarks, item.found === 1 ? '4' : ''];
        return [rowData];
      }
    });
  };

  if (isLoading) {
    return <LoadingBtn title="Generating PDF" />;
  }

  return (
    <React.Fragment>
      <CRow>
        <CCol className="d-flex justify-content-center align-items-center">
          <Tooltip title="Download Report">
            <FileDownloadOutlinedIcon
              fontSize="medium"
              className="stock-toggle-icon"
              // icon={cilCloudDownload}
              onClick={() => generatePdf()}
            />
          </Tooltip>
        </CCol>
        <CCol>
          <Tooltip title="Edit Report">
            <CIcon
              className="stock-toggle-icon"
              icon={cilPencil}
              onClick={() => setIsInspRepMdlOpen(true)}
            />
          </Tooltip>
        </CCol>
      </CRow>
      <AddInspectionModal
        header="Inspection Report"
        reportField={reportField}
        isOpen={isInspReMdlOpen}
        toggle={() => setIsInspRepMdlOpen(!isInspReMdlOpen)}
        fetchInspection={fetchInspection}
      />
    </React.Fragment>
  );
};
export default InspectionReportCell;
