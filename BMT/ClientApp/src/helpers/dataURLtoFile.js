export function dataURLtoFile(dataURL, filename) {
  // Convert the base64 data to a Blob
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });

  // Create a File object with optional filename
  return new File([blob], filename || 'file', { type: mimeString });
}
export function fileToBase64(filePath) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Read the file as a data URL
    reader.readAsDataURL(filePath);

    // Set up the callback for when the reading is done
    reader.onloadend = () => {
      // 'result' contains the data URL
      const base64Data = reader.result;
      resolve(base64Data);
    };

    // Handle errors during file reading
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export function convertBase64ToSVG(base64String) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${
        img.height
      }">
                            <image xlink:href="${canvas.toDataURL('image/png')}"/>
                          </svg>`;

      resolve(svgString);
    };

    img.onerror = function () {
      reject(new Error('Failed to load the image.'));
    };

    img.src = base64String;
  });
}
export const convertPointsToSVG = (signaturePoints, width = 400, height = 200) => {
  const svgPaths = signaturePoints.map((pointGroup) => {
    const pathData = `M${pointGroup.map((point) => `${point.x} ${point.y}`).join(' L')}`;
    return `<path d="${pathData}" fill="none" stroke="white" stroke-width="2" />`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgPaths.join(
    '',
  )}</svg>`;
};
export const svgPathToPoints = (svgString) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

  const paths = Array.from(svgDoc.querySelectorAll('path'));
  const allPoints = [];

  paths.forEach((pathElement) => {
    const pathArray = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathArray.setAttribute('d', pathElement.getAttribute('d'));

    const length = pathArray.getTotalLength();
    const points = [];

    for (let i = 0; i < length; i += 1) {
      const point = pathArray.getPointAtLength(i);
      points.push({ x: point.x, y: point.y });
    }

    allPoints.push(points);
  });

  return allPoints;
};

export const svgToBase64 = (svgString) => {
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
};
