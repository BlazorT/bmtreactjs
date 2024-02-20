import jsPDF from 'jspdf';
import globalutil from 'src/util/globalutil';
import { formatDateTime } from './formatDate';
import moment from 'moment';

export const getInventoryPdf = (reportRows, reportField) => {
  const doc = new jsPDF({ orientation: 'p', format: 'letter', unit: 'mm' });
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().replace(/[:.]/g, '');

  const totalStock = reportRows.reduce((total, [, stock]) => {
    const isNumber = parseInt(stock)
    if (!isNaN(isNumber)) {
      console.log({ total });
      return parseInt(total) + isNumber;
    }
    else {
      return parseInt(total);
    }
  }, 0); console.log(totalStock, 'total');
  const totalAvailStock = reportRows.reduce((total, [,,, stock]) => {
    const isNumber = parseInt(stock)
    if (!isNaN(isNumber)) {
      console.log({ total });
      return parseInt(total) + isNumber;
    }
    else {
      return parseInt(total);
    }
  }, 0); console.log(totalAvailStock, 'total');
  // Header
  const pageX = 5;
  doc.setProperties({ title: `DVIR_${formattedDate}` });
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('6BY7 LLC', pageX, 15);
  doc.setFontSize(14);
  doc.setFont('times', 'normal');
  doc.text('402 Rolling Green Ave New Castle DE 19720', pageX, 22);
  doc.text('+1 302-339-0082', pageX, 27);

  // Logo
  const logo = new Image();
  logo.src = 'bmtlogo.png'; // Replace with the path to your logo image
  doc.addImage(logo, 'jpeg', doc.internal.pageSize.width - 30, 1, 30, 30);

  // Main Heading
  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.text('Inventory Report (IR) ', 5, 40);

  // Border under the heading
  doc.setLineWidth(0);
  doc.line(pageX, 45, doc.internal.pageSize.width - pageX, 45);

  // Additional Information
  //const additionalInfo = [
  //  // { key: 'Vehicle Name', value: reportField[0].vName },
  //];

  //const addionalLeftInfo = [
  //  // { key: 'Product Name', value: reportField[0].pName },
  //];

  // Add additional information in a list format
  doc.setFontSize(12);
  //additionalInfo.forEach(({ key, value }, index) => {
  //  const yPos = 50 + index * 6;
  //  doc.setFont('times', 'bold');
  //  doc.text(`${key}:`, pageX, yPos);
  //  doc.setFont('times', 'normal');
  //  const spaceAfterKey = doc.getTextWidth(`${key}:   `);
  //  doc.text(pageX + spaceAfterKey, yPos, value);
  //});

  //addionalLeftInfo.forEach(({ key, value }, index) => {
  //  const yPos = 50 + index * 6;
  //  doc.setFont('times', 'bold');
  //  doc.text(`${key}:`, 100, yPos);
  //  doc.setFont('times', 'normal');
  //  const spaceAfterKey = doc.getTextWidth(`${key}:   `);
  //  doc.text(100 + spaceAfterKey, yPos, value);
  //});

  // Explanation Text
  doc.setFontSize(10);
  const labelY = 35 + 2 + 5;
  //doc.setFont('Zapfdingbats', 'normal');
  //doc.text('4', doc.internal.pageSize.width - 65, labelY + 5);
  //doc.setFont('times', 'normal');
  //doc.text(
  //  '= Not satisfactory (blank) = Satisfactory',
  //  doc.internal.pageSize.width - 62,
  //  labelY + 5,
  //);
  
  // Table Headers
  const data = reportRows;
  
  // Set the table starting position
  let tableY = labelY;

  // Set the column widths
  const columnWidths = [75,35,30,35,30];

  // Set the font size
  const fontSize = 10;

  // Set the table styles
  const headerStyle = { fillColor: '#525659', textColor: '#ffffff' };
  const rowStyle = { normal: '#f2f2f2', highlighted: '#d9d9d9' };

  // Draw the table headers
  let tableX = pageX;

  let group = 1;
  data.forEach((row) => {
    const isVehicleSideNotEmpty = row[0] === 'name';
    const isGroup =
      row[0] === 'Front Side' ||
      row[0] === 'Back Side' ||
      row[0] === 'Driver Side' ||
      row[0] === 'Passenger Side' ||
      row[0] === 'In Cab';
    const currentRowStyle = isGroup ? rowStyle.highlighted : rowStyle.normal;

    // Check if it is a group and adjust the tableX and width accordingly
    const fullWidth = doc.internal.pageSize.width - 10; // Adjust the padding as needed
    if (isGroup) {
      doc.setFillColor(headerStyle.textColor);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setLineWidth(0.005);
      doc.setFont('times', 'bold');
      doc.rect(tableX, tableY + 10, fullWidth, 10, 'FD'); // Set the width to the whole page
      doc.text(group + '. ' + row[0], tableX + 2, tableY + 16); // Draw the group name in the cell
      group = group + 1;
    } else {
      row.forEach((cell, index) => {
        // Check if there is enough space on the current page
        const remainingSpace = doc.internal.pageSize.height - tableY;
        if (remainingSpace < 30) {
          // If not enough space, move to the next page
          doc.addPage();
          tableY = 0;
        }

        // Set the border color
        doc.setDrawColor(0); // Black border

        if (isVehicleSideNotEmpty) {
          doc.setFillColor(headerStyle.fillColor);
          doc.setTextColor(headerStyle.textColor);
          doc.setFontSize(fontSize);
          if (cell === '4') {
            doc.setFont('Zapfdingbats', 'normal');
          } else {
            doc.setFont('times', 'normal');
          }
        } else {
          doc.setFillColor(headerStyle.textColor);
          doc.setTextColor(0, 0, 0);
          doc.setLineWidth(0.005);
          doc.setFontSize(fontSize);
          if (cell === '4') {
            doc.setFont('Zapfdingbats', 'normal');
          } else {
            doc.setFont('times', 'normal');
          }
        }

        // Draw the cell
        doc.setLineWidth(0.005);
        doc.rect(tableX, tableY + 10, isGroup ? fullWidth : columnWidths[index], 10, 'FD');
        doc.text(cell, tableX + 2, tableY + 16);
        tableX += isGroup ? fullWidth : columnWidths[index];
      });
    }

    tableX = pageX;
    tableY += 10;
  });

  // ... (rest of the code)

  // Draw Inspection Summary
  doc.addPage();
  doc.setFontSize(10);
  //const summaryLabels = [
  //  ['Condition satisfactory'],
  //  ['Condition unsatisfactory'],
  //  ['Defects corrected'],
  //  ['Repairs not required'],
  //];

  const summaryY = 10;

  // Check if there is enough space on the current page for the summary
  const remainingSpace = doc.internal.pageSize.height - summaryY;
  if (remainingSpace < 10) {
    doc.addPage();
  }

  // Draw the background color for the summary
  //doc.setFillColor('#d9d9d9');
  //doc.rect(pageX, summaryY, doc.internal.pageSize.width - 10, 10, 'FD');

  // Draw the Inspection Summary text
 // doc.setTextColor(0);
 // doc.setFont('times', 'bold');
//  doc.text('Inspection Summary:', 8, summaryY + 6);
 // doc.setFont('times', 'normal');
  //summaryLabels.forEach((label, index) => {
  //  const labelX = index < 2 ? 47 + index * 40 : 60 + index * 35;

  //  // Draw the rectangle
  //  doc.setDrawColor(0);
  //  doc.setFillColor('#d9d9d9');
  //  doc.rect(labelX - 5, summaryY + 3.5, 3, 3, 'FD');

  //  // Draw a checkmark inside the rectangle
  //  doc.setTextColor(0);
  //  doc.setFontSize(8);
  //  //if (reportField[0].status == 2 && label[0] == 'Condition unsatisfactory') {
  //  //  doc.text('X', labelX - 4.5, summaryY + 6);
  //  //} else if (label[0] == 'Condition satisfactory' && reportField[0].status == 1) {
  //  //  doc.text('X', labelX - 4.5, summaryY + 6);
  //  //}

  //  // Draw the label
  //  doc.setTextColor(0);
  //  doc.setFontSize(10);
  //  doc.text(label, labelX, summaryY + 6);
  //});

  // Add a new page for the next section

  // Render the "Driver Submission" section
  //renderSubmissionSection(
  //  'Driver Submission',
  //  reportField[0].inspectorName,
  //  'Submitting driver/auditor',
  //  40,
  //  doc,
  //  moment(reportField[0].lastUpdatedAt).utc().format('MM/DD/YYYY HH:mm:ss') + ' UTC',
  //);

  // Render the "Certification of correction" section
  renderSubmissionSection('Total Stock', totalStock.toString(), '-', 70, doc, '-');

  // Render the "Review of corrections" section
  renderSubmissionSection('Available Stock', totalAvailStock.toString(), '-', 90, doc, '-');

  // Output the PDF
  doc.save(`DVIR_${formattedDate}`);
  return doc;
};

function renderSubmissionSection(label, value, subfield, startY, doc, time) {

  const sectionLabelY = startY;

  const sectionTextFieldY = sectionLabelY + 10;

  const sectionTextFieldWidth = 80;

  const sectionTextFieldX = 5;

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.text(label, 5, sectionLabelY);

  doc.setLineWidth(0.5);
  doc.line(
    sectionTextFieldX,
    sectionTextFieldY - 2,
    sectionTextFieldX + sectionTextFieldWidth,
    sectionTextFieldY - 2,
  );
  doc.setFont('times', 'normal');

  doc.text(value, sectionTextFieldX, sectionTextFieldY - 3);

  doc.text(subfield, sectionTextFieldX, sectionTextFieldY + 2);
  doc.setFont('times', 'bold');

  if (time !== '-') {


    doc.text(`Date and time : ${time}`, sectionTextFieldX + 100, sectionTextFieldY - 3);

  }
}
