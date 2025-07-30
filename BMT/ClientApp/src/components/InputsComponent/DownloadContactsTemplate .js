import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from '@mui/material'; // or any button component you're using

const sampleContacts = [
  { Contact: '923001234567' },
  { Contact: '923451234567' },
  { Contact: '923101234567' },
  { Contact: '923211234567' },
  { Contact: '923331234567' }
];

const DownloadContactsTemplate = () => {
  const downloadFile = (type = 'csv') => {
    const worksheet = XLSX.utils.json_to_sheet(sampleContacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    if (type === 'csv') {
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'contacts_template.csv');
    } else if (type === 'excel') {
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'contacts_template.xlsx');
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Button variant="outlined" color="primary" onClick={() => downloadFile('csv')} style={{ marginRight: 8 }}>
        Download CSV
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => downloadFile('excel')}>
        Download Excel
      </Button>
      <p style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '14px', color: 'rgb(199 187 187)' }}>
        <strong>Note:</strong> Download excel or csv file and fill network contacts for campaign purpose. For import, you need to select a file and then press <strong>Import Contacts</strong>. For final save, click the bottom <strong>&quot;Save&quot;</strong> button. A detailed message will appear showing saved and imported contacts.
      </p>
    </div>
  );
};

export default DownloadContactsTemplate;
