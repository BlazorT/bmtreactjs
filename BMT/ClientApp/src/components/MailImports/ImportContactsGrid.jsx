/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import useApi from 'src/hooks/useApi';
import { useSelector } from 'react-redux';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../UI/Button';

const COLS = [
  {
    key: 'content',
    name: 'Contact',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'name',
    name: 'Name',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'type',
    name: 'Type',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
    renderCell: (params) => (params.row.type === 1 ? 'Contact' : 'Email'),
  },
];

const ImportContactsGrid = ({ data, getRecipientList, recipientsList }) => {
  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  const { postData, loading } = useApi('/Compaigns/postCompaignContactData');

  const [selectedRows, setSelectedRows] = useState(new Set());

  // Add a memoized version of data with disabled flag
  const rowsWithDisabled = useMemo(() => {
    const existingIds = new Set(recipientsList.map((r) => r.contentId));
    return data.map((row) => ({
      ...row,
      disabled: existingIds.has(row.content), // disable if already in recipients
    }));
  }, [data, recipientsList]);

  // Calculate counts
  const counts = useMemo(() => {
    const existingCount = rowsWithDisabled.filter((row) => row.disabled).length;
    const importedCount = rowsWithDisabled.length;
    const selectedCount = selectedRows.size;

    return { existingCount, importedCount, selectedCount };
  }, [rowsWithDisabled, selectedRows]);

  const submitRecipients = async () => {
    if (selectedRows?.size === 0) {
      showToast('Select at least 1 contact to add', 'info');
      return;
    }

    const selectedContacts = rowsWithDisabled.filter(
      (row) => selectedRows.has(row.content) && !row.disabled,
    );
    const type1Contacts = selectedContacts
      .filter((row) => row.type === 1)
      .map((row) => row.content);

    const type3Contacts = selectedContacts
      .filter((row) => row.type === 2)
      .map((row) => row.content);

    const body = [];

    if (type1Contacts.length > 0) {
      body.push(
        {
          Id: 0,
          OrgId: user.orgId,
          NetworkId: 1,
          Contentlst: type1Contacts,
          Desc: '',
          CreatedBy: user.userId,
          CreatedAt: new Date(),
          LastUpdatedAt: new Date(),
          RowVer: 1,
        },
        {
          Id: 0,
          OrgId: user.orgId,
          NetworkId: 2,
          Contentlst: type1Contacts,
          Desc: '',
          CreatedBy: user.userId,
          CreatedAt: new Date(),
          LastUpdatedAt: new Date(),
          RowVer: 1,
        },
      );
    }

    if (type3Contacts.length > 0) {
      body.push({
        Id: 0,
        OrgId: user.orgId,
        NetworkId: 3,
        Contentlst: type3Contacts,
        Desc: '',
        CreatedBy: user.userId,
        CreatedAt: new Date(),
        LastUpdatedAt: new Date(),
        RowVer: 1,
      });
    }

    console.log('Request body:', body);

    const res = await postData(body);
    if (res?.status) {
      showToast(res?.message, 'success');
      getRecipientList();
      setSelectedRows(new Set());
    }
  };

  return (
    <div>
      <CustomDatagrid
        rows={rowsWithDisabled}
        columns={COLS}
        rowSelection={true}
        selectedRows={selectedRows}
        loading={loading}
        onSelectedRowsChange={(newSelectedRows) => {
          setSelectedRows(newSelectedRows);
        }}
        rowSelectable={(row) => !row.disabled}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        pagination={false}
        maxHeight={rowsWithDisabled?.length > 10 ? 400 : 'auto'}
        footer={
          <div className="bg-dark-color text-white p-2 d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row align-items-center gap-3">
              <div className="d-flex flex-row align-items-center gap-2">
                <span>Existing :</span>
                <span className="disabled-row-red rounded-1 px-2 py-1 fw-bold">
                  {counts.existingCount}
                </span>
              </div>
              <div className="d-flex flex-row align-items-center gap-2">
                <span>Imported :</span>
                <span className="rdg-row-even rounded-1 px-2 py-1 fw-bold">
                  {counts.importedCount}
                </span>
              </div>
              <div className="d-flex flex-row align-items-center gap-2">
                <span>Selected :</span>
                <span className="selected-row rounded-1 px-2 py-1 fw-bold">
                  {counts.selectedCount}
                </span>
              </div>
            </div>
          </div>
        }
      />
      <div className="mt-2 align-items-center justify-content-end flex-row d-flex">
        <Button title="Submit" onClick={submitRecipients} disabled={loading} />
      </div>
    </div>
  );
};

export default ImportContactsGrid;
