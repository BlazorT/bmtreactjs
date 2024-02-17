import React, { useEffect, useState } from 'react';

import { cilChevronBottom } from '@coreui/icons';
import { Box } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';

import FieldMappingModal from 'src/components/Modals/FieldMappingModal';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import CustomGridToolbar from 'src/components/DataGridComponents/CustomGridToolbar';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'src/hooks/useFetch';

import { updateToast } from 'src/redux/toast/toastSlice';
import Loading from 'src/components/UI/Loading';

import { getFieldMappingCols } from 'src/configs/ColumnsConfig/fieldMappingCols';
import AppContainer from 'src/components/UI/AppContainer';
import FieldMappingActionCell from 'src/components/DataGridCustomCells/FieldMappingActionCell';

const WorkFlowFieldMapping = () => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Field Mapping',
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetchFeildMapping();
  }, []);

  const { fetchData: fetchFields } = useFetch();

  const [isCollapse, setIsCollapse] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isFieldModalMappingOpen, setIsFieldModalMapping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]);
  const [serviceRows, setserviceRows] = useState([]);
  const [params, setParams] = useState();

  const apiRef = useGridApiRef();

  const fetchFeildMapping = async () => {
    const fetchBody = {
      id: 0,
      entityId: 0,
      dataTypeId: 0,
      fieldTypeId: 0,
      length: 0,
      createdBy: 0,
      status: 0,
      rowVer: 1,
    };

    await fetchFields(
      '/Workflow/workflowfields',
      { method: 'POST', body: JSON.stringify(fetchBody) },
      (res) => {
        if (res.status) {
          setFields(res.data);
          formatApiDataAsRows(res.data);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          setRows([]);
        }
      },
    );
    setIsLoading(false);
  };

  const formatApiDataAsRows = (apiData) => {
    const mappedArray = apiData.map((data) => ({
      id: data.id,
      entity: data.entityId,
      fieldName: data.name,
      dataType: data.dataTypeId,
      service: data.serviceId,
      serviceField: data.name,
      status: data.status,
      fieldType: data.fieldTypeId,
      lastUpdatedAt: data.lastUpdatedAt,
    }));
    setserviceRows(mappedArray.filter((data) => data.service !== null && data.service !== 0));
    setRows(mappedArray.filter((data) => data.service === null || data.service === 0));
  };

  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const toggleFieldMappingMdl = () => {
    setIsFieldModalMapping(!isFieldModalMappingOpen);
  };

  const toggleFieldMdl = () => {
    setIsFieldModalOpen(!isFieldModalOpen);
  };

  const onRowClick = (params) => {
    console.log({ params });
    setParams(params);
  };

  const fieldMappingCols = getFieldMappingCols(pageRoles, fetchFeildMapping, fields);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppContainer>
      <DataGridHeader
        title="Entity Field Mapping"
        addButton={pageRoles.canAdd === 1 ? 'Field Mapping' : ''}
        addBtnClick={toggleFieldMappingMdl}
        addSecButton={pageRoles.canAdd === 1 ? 'Add Field (+)' : ''}
        addSecBtnClick={toggleFieldMdl}
        otherControls={[{ icon: cilChevronBottom, fn: toggleCollapse }]}
        actionCell={
          params && (
            <FieldMappingActionCell
              value={params}
              canUpdate={pageRoles.canUpdate}
              canDelete={pageRoles.canDelete}
              fetchFeildMapping={fetchFeildMapping}
              fieldData={fields?.find((item) => item?.id === params?.row?.id)}
              fields={fields}
            />
          )
        }
      />

      <FieldMappingModal
        header={'Field Mapping'}
        isOpen={isFieldModalMappingOpen}
        toggle={toggleFieldMappingMdl}
        isOnlyField={false}
        fields={fields}
        fetchFeildMapping={fetchFeildMapping}
      />
      <FieldMappingModal
        header={'Add Field'}
        isOpen={isFieldModalOpen}
        toggle={toggleFieldMdl}
        isOnlyField={true}
        fetchFeildMapping={fetchFeildMapping}
        fields={fields}
      />
      {!isCollapse && (
        <div className="show-stock">
          <div className="row pt-2">
            <div className="col-md-6 ">
              <Box sx={{ width: '100%' }}>
                <div className="bckColor">
                  <strong className="d-flex align-items-center justify-content-center w-100 headSize">
                    4DSPS
                  </strong>
                </div>
                <CustomDatagrid
                  rows={rows}
                  columns={fieldMappingCols}
                  rowHeight={45}
                  pagination={true}
                  canExport={pageRoles.canExport}
                  canPrint={pageRoles.canPrint}
                  sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
                  rowSelection
                  apiRef={apiRef}
                  onRowClick={onRowClick}
                  hiddenCols={{
                    columnVisibilityModel: {
                      lastUpdatedAt: false,
                      service: false,
                      entity: false,
                    },
                  }}
                />
              </Box>
            </div>

            <div className="col-md-6 ">
              <div className="bckColor">
                <strong className="d-flex align-items-center justify-content-center w-100 headSize">
                  3rd Party
                </strong>
              </div>
              <Box sx={{ width: '100%' }}>
                <CustomDatagrid
                  rows={serviceRows}
                  columns={fieldMappingCols}
                  rowHeight={45}
                  pagination={true}
                  apiRef={apiRef}
                  toolbar={CustomGridToolbar}
                  canExport={pageRoles.canExport}
                  canPrint={pageRoles.canPrint}
                  sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
                  rowSelection
                  onRowClick={onRowClick}
                  hiddenCols={{
                    columnVisibilityModel: {
                      lastUpdatedAt: false,
                    },
                  }}
                />
              </Box>
            </div>
          </div>
        </div>
      )}
    </AppContainer>
  );
};

export default WorkFlowFieldMapping;
