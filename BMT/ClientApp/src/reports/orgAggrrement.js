import dayjs from 'dayjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a PDF with company header, agreement text, and signature
 * @param {string} signatureSVG - SVG string of the signature
 * @param {string} signerName - Name of the person signing (optional)
 * @returns {Promise<Uint8Array>} PDF as byte array
 */
export async function generateAgreementPDF(
  signatureSVG,
  signerName = '',
  dt = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add pages (we'll need at least 2 pages for all content)
  let page = pdfDoc.addPage([595, 842]); // A4 size in points
  const { width, height } = page.getSize();

  // Embed fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Load and embed logo
  let logoImage;
  try {
    const logoBytes = await fetch('/BDMT_TRANSPARENT.png').then((res) => res.arrayBuffer());
    logoImage = await pdfDoc.embedPng(logoBytes);
  } catch (error) {
    console.error('Error loading logo:', error);
  }

  // Define margins and positions
  const margin = 50;
  let yPosition = height - margin;

  // --- HEADER SECTION ---
  // Draw logo on the right side
  if (logoImage) {
    const logoWidth = 160;
    const logoHeight = 80;
    page.drawImage(logoImage, {
      x: width - margin - logoWidth,
      y: yPosition - 50,
      width: logoWidth,
      height: logoHeight,
    });
  }

  // Company information on the left
  page.drawText('Blazor Media Toolkit', {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;
  page.drawText('54700, 216-A Bahria Al-Rehmat, Pecco Rd, Lahore, Pakistan', {
    x: margin,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 15;
  page.drawText('+92 42-35132337', {
    x: margin,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Draw a line separator
  yPosition -= 20;
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  yPosition -= 30;

  // --- TITLE ---
  page.drawText('Guidelines and Privacy Policy', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;

  // --- INTRODUCTION PARAGRAPH ---
  const introText =
    'BMT is created in the spirit of peaceful civic engagement. We do not permit the use of bigoted language, anti-government or anti-law enforcement rhetoric or the provocation of violence of any kind. BMT bears no tolerance for objectionable content or abusive users. We reserve the right to not post any vehicle that we deem inappropriate or subversive to the spirit of our platform.';
  yPosition = drawWrappedText(
    page,
    introText,
    margin,
    yPosition,
    width - 2 * margin,
    regularFont,
    10,
  );

  yPosition -= 20;

  // --- SECTION: Do not post... ---
  page.drawText('Do not post, upload, stream, or share:', {
    x: margin,
    y: yPosition,
    size: 11,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 18;

  const prohibitedItems = [
    'Content that boasts, praise or promotes past, present, or future crimes',
    'Unnecessary graphic details of crimes',
    "Yours or anyone else's' legal paperwork including court documents, victim documents or official documents from government agencies",
    'Admissions of guilt for crimes you have not been convicted of',
    'Names of individuals other than yourself or the loved one you are speaking on behalf of',
    'Individual personal addresses of you or anyone else',
    'Names of victims, co-defendants, witnessed or perpetrators nor names of specific correctional officers',
    'Content that encourages aggressive / angry words or actions directed at public officials, officers of the court, correctional officers, judges or any employee of the state',
    'Gang names, symbols, flags, logos or gestures',
    'Content that ridicules victims or their families',
    'Firearms or weapons of any kind including ammunition and / or accessories',
    'Content that depicts or promotes the usage of drugs, and or alcohol',
    'Content that solicits money or financial assistance for you, your loved one or any one at all',
    'Content that expresses, insinuates, or hints at the guilt of non-convicted citizens',
    'Explicit language',
    'Violent threats against any individual or entity of any kind',
    'Nudity or obscenity',
    'Content that equates to conspiracy theories',
    'Misinformation, lies or half-truths',
    'Personal medical records of you or anyone else',
    'Personal identity information such as bank account information, bank statements, social security numbers and/or card, drivers license or any other sensitive content of similar nature',
    'Personal login codes, names or passwords for you or anyone else',
    "Content that violates or infringes on someone else's legally held copyright, trademark, intellectual property or patten",
  ];

  for (const item of prohibitedItems) {
    // Check if we need a new page
    if (yPosition < 100) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - margin;
    }

    yPosition = drawBulletPoint(page, item, margin, yPosition, width - 2 * margin, regularFont, 9);
    yPosition -= 5;
  }

  yPosition -= 15;

  // Check if we need a new page for Content Integrity section
  if (yPosition < 150) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - margin;
  }

  // --- SECTION: Content Integrity ---
  page.drawText('Content Integrity', {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 18;

  const integrityItems = [
    'BMT expects every vehicle-share to contain authentic stories of truthfulness and honesty without lies fabrications or exaggerations.',
    'BMT is not responsible for stories or details within a story that may turn out to be falsified by the vehicle-share.',
    'BMT reserves the right to inquire with family, friends, law enforcement and policymakers about the truthfulness of your story including generalizations and / or details pertaining to people, places, things, and situations. We understand that situational evidence is subjective and that there may be numerous views and opinions about the same incident. If however, BMT discovers that any part of your story is false, your account will be suspended and your vehicle removed permanently.',
  ];

  for (const item of integrityItems) {
    if (yPosition < 100) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - margin;
    }

    yPosition = drawBulletPoint(page, item, margin, yPosition, width - 2 * margin, regularFont, 9);
    yPosition -= 5;
  }

  yPosition -= 20;

  // --- LAST UPDATED ---
  if (yPosition < 150) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - margin;
  }

  page.drawText('Last Updated: February 14, 2023', {
    x: margin,
    y: yPosition,
    size: 9,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 40;

  // --- SIGNATURE SECTION ---
  if (yPosition < 200) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - margin;
  }

  yPosition -= 50;
  // Draw signature line
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: margin + 200, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawText('Signature', {
    x: margin,
    y: yPosition - 10,
    size: 9,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Embed and draw signature (SVG converted to PNG)
  if (signatureSVG) {
    try {
      // Convert SVG to PNG data URL
      //   const modifiedSvg = signatureSVG.replace(/stroke="white"/g, 'stroke="black"');
      //   const signatureDataUrl = await svgToPngDataUrl(modifiedSvg);

      // Extract base64 data and embed
      //   const base64Data = signatureDataUrl.split(',')[1];
      //   const signatureBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      //   const signatureImage = await pdfDoc.embedPng(signatureBytes);

      //   const sigWidth = 150;
      //   const sigHeight = (signatureImage.height / signatureImage.width) * sigWidth;

      //   page.drawImage(signatureImage, {
      //     x: margin,
      //     y: yPosition - 35,
      //     width: sigWidth,
      //     height: sigHeight,
      //   });
      [...signatureSVG.matchAll(/d="([^"]*)"/g)]
        .map((match) => match[1])
        .forEach((pathString) => {
          page.drawSvgPath(pathString, {
            x: margin,
            y: yPosition + 45,
            borderWidth: 3,
            scale: 0.4,
          });
        });
    } catch (error) {
      console.error('Error embedding signature:', error);
    }
  }

  // Add date
  //   yPosition -= 50;
  page.drawLine({
    start: { x: width - margin - 200, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  //   yPosition -= 5;
  page.drawText('Date', {
    x: width - margin - 200,
    y: yPosition - 10,
    size: 9,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Current date
  const currentDate = dayjs(dt).format('MMM D, YYYY • h:mm A');

  page.drawText(currentDate, {
    x: width - margin - 200,
    y: yPosition + 5,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Add signer name if provided
  if (signerName) {
    page.drawText(`Signed by: ${signerName}`, {
      x: margin,
      y: yPosition - 40,
      size: 10,
      font: regularFont,
      color: rgb(0, 0, 0),
    });
  }

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  const today = new Date();
  const formattedDate = today.toISOString().replace(/[:.]/g, '');

  // Download the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  // Create a URL for the Blob and open or download the PDF
  window.open(link.href); // Open in new tab
  link.download = `BMT_Agreement_${formattedDate}.pdf`;
  link.click();

  return pdfBytes;
}

/**
 * Helper function to draw wrapped text
 */
function drawWrappedText(page, text, x, y, maxWidth, font, fontSize) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && i > 0) {
      page.drawText(line, { x, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
      line = words[i] + ' ';
      currentY -= fontSize + 3;
    } else {
      line = testLine;
    }
  }

  page.drawText(line, { x, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
  return currentY - fontSize - 3;
}

/**
 * Helper function to draw bullet points with wrapped text
 */
function drawBulletPoint(page, text, x, y, maxWidth, font, fontSize) {
  page.drawText('•', { x, y, size: fontSize, font, color: rgb(0, 0, 0) });

  const bulletOffset = 15;
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth - bulletOffset && i > 0) {
      page.drawText(line, {
        x: x + bulletOffset,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      line = words[i] + ' ';
      currentY -= fontSize + 3;
    } else {
      line = testLine;
    }
  }

  page.drawText(line, {
    x: x + bulletOffset,
    y: currentY,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  return currentY - fontSize - 3;
}

/**
 * Convert SVG to PNG data URL
 */
async function svgToPngDataUrl(svgString) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Convert SVG string to data URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pngDataUrl = canvas.toDataURL('image/png');
      URL.revokeObjectURL(url);
      resolve(pngDataUrl);
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    img.src = url;
  });
}

/**
 * Example usage:
 *
 * const pdfBytes = await generateAgreementPDF(signatureSVG, 'John Doe');
 *
 * // Download the PDF
 * const blob = new Blob([pdfBytes], { type: 'application/pdf' });
 * const link = document.createElement('a');
 * link.href = URL.createObjectURL(blob);
 * link.download = 'BMT_Agreement.pdf';
 * link.click();
 */
