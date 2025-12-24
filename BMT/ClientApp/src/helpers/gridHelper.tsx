interface GridContent {
  head: string[][];
  body: string[][];
  foot?: string[][];
}
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

export async function exportToPdf(gridEl: HTMLDivElement, fileName: string): Promise<void> {
  const { head, body, foot } = getGridContent(gridEl);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = {
    top: 2,
    right: 2,
    bottom: 2,
    left: 2,
  };

  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const totalPagesPlaceholder = '{total_pages_count_string}';

  autoTable(doc, {
    head,
    body,
    foot,
    startY: margin.top,
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

    // Add extra top padding only for the very first data row
    didParseCell: (data) => {
      if (data.section !== 'body' || data.row.index !== 0) return;

      const basePadding = 1;
      const padding =
        typeof data.cell.styles.cellPadding === 'number'
          ? data.cell.styles.cellPadding
          : basePadding;

      // Override only top padding
      data.cell.styles.cellPadding = {
        top: 2.5, // ← the extra gap you wanted
        right: padding,
        bottom: padding,
        left: padding,
      };
    },

    didDrawPage: (data) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFontSize(8);
      doc.setTextColor(100);

      // Left: Print date
      doc.text(`Printed: ${printDate}`, margin.left, pageHeight - 10);

      // Right: Page X of Y (placeholder will be replaced later)
      const pageText = `Page ${doc.getCurrentPageInfo().pageNumber} of ${totalPagesPlaceholder}`;
      doc.text(pageText, pageWidth + 25, pageHeight - 10, { align: 'right' });
    },
  });

  // Important: must be called after autoTable has finished
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
