import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function exportToCsv(gridEl: HTMLDivElement, fileName: string) {
  const { head, body, foot } = getGridContent(gridEl);
  const content = [...head, ...body, ...foot]
    .map((cells) => cells.map(serialiseCellValue).join(','))
    .join('\n');

  downloadFile(fileName, new Blob([content], { type: 'text/csv;charset=utf-8;' }));
}

export async function exportToPdf(
  gridEl: HTMLDivElement,
  fileName: string,
  user: any,
): Promise<void> {
  const { head, body, foot } = getGridContent(gridEl);

  const orgInfo = user?.orgInfo || {};

  const orgName = orgInfo.name || 'Company Name';
  const orgAddress = orgInfo.address || '';
  const orgContact = orgInfo.contact || '';
  const orgLogo = 'BDMT_TRANSPARENT.png'; // make sure this path works or use full url/base64
  const namePart = fileName?.split('_');
  const reportName = namePart?.[0] || '';

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const margin = {
    top: 12,
    right: 6,
    bottom: 12,
    left: 6,
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const totalPagesPlaceholder = '{total_pages_count_string}';

  // ── FIRST PAGE ONLY: Organization info + logo + filename ──
  let startY = 0;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(orgName, margin.left, startY + 6);

  // Logo on the very left (adjust size & position as needed)
  try {
    const logoWidth = 60;
    const logoHeight = 30; // keep your aspect ratio
    doc.addImage(orgLogo, 'PNG', pageWidth - margin.right - 50, startY, logoWidth, logoHeight);
    startY += 6; // space after logo
  } catch (e) {
    console.warn('Could not load logo:', e);
  }

  // Organization details (below logo or beside if you prefer)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(orgAddress, margin.left, startY + 5);
  doc.text(orgContact, margin.left, startY + 10);

  startY += 18; // extra space after org info

  // File name
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(reportName.replace(/\.pdf$/i, ''), margin.left, startY + 6);

  startY += 10;

  doc.setLineWidth(0.5); // thinner looks better for separators
  doc.line(margin.left, startY, pageWidth - margin.right, startY);

  startY += 6; // space before table

  // ── Now the table ──
  autoTable(doc, {
    head,
    body,
    foot,
    startY: startY, // ← important: start after our custom header
    margin,
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    showHead: 'everyPage',
    styles: {
      cellPadding: 2,
      fontSize: 7.5,
      cellWidth: 'wrap',
      overflow: 'linebreak',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [120, 120, 120],
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [40, 40, 40],
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 3,
      lineWidth: 0.3,
      lineColor: [100, 100, 100],
      halign: 'center',
      valign: 'middle',
    },
    // Optional: extra top padding only for first data row
    didParseCell: (data) => {
      if (data.section !== 'body' || data.row.index !== 0) return;

      const basePadding = 1;
      const padding =
        typeof data.cell.styles.cellPadding === 'number'
          ? data.cell.styles.cellPadding
          : basePadding;

      data.cell.styles.cellPadding = {
        top: 2.5,
        right: padding,
        bottom: padding,
        left: padding,
      };
    },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFontSize(8);
      doc.setTextColor(100);

      // Left: Print date
      doc.text(`Printed: ${printDate}`, margin.left, pageHeight - 8);

      // Right: Page X of Y
      const pageText = `Page ${doc.getCurrentPageInfo().pageNumber} of ${totalPagesPlaceholder}`;
      doc.text(pageText, pageWidth - 25, pageHeight - 8);
    },
  });

  // Replace total pages placeholder
  if ('putTotalPages' in doc && typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesPlaceholder);
  }

  doc.save(fileName);
}

function getGridContent(gridEl: HTMLDivElement) {
  const allHeaderRows = getRows('.rdg-header-row');
  const actionIndex = allHeaderRows[0]?.findIndex((cell) => cell.trim().toLowerCase() === 'action');

  function removeActionCell(row: string[]) {
    if (actionIndex !== undefined && actionIndex >= 0) {
      const newRow = [...row];
      newRow.splice(actionIndex, 1);
      return newRow;
    }
    return row;
  }

  return {
    head: allHeaderRows.map(removeActionCell),
    body: getRows('.rdg-row:not(.rdg-summary-row)').map(removeActionCell),
    foot: getRows('.rdg-summary-row').map(removeActionCell),
  };

  function getRows(selector: string) {
    return Array.from(gridEl.querySelectorAll<HTMLDivElement>(selector)).map((gridRow) =>
      Array.from(gridRow.querySelectorAll<HTMLDivElement>('.rdg-cell')).map((gridCell) =>
        gridCell.innerText.trim(),
      ),
    );
  }
}

function serialiseCellValue(value: unknown) {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(',') ? `"${formattedValue}"` : formattedValue;
  }
  return value;
}

function downloadFile(fileName: string, data: Blob) {
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  const url = URL.createObjectURL(data);
  downloadLink.href = url;
  downloadLink.click();
  URL.revokeObjectURL(url);
}
