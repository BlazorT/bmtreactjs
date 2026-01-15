/* eslint-disable react/prop-types */
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { convertPointsToSVG, svgPathToPoints, svgToBase64 } from 'src/helpers/dataURLtoFile';

const SignatureBoard = ({ label, signature, setSignature, width }) => {
  const [canvasWidth, setCanvasWidth] = useState(
    width ?? (window.innerWidth <= 400 ? 250 : window.innerWidth <= 767 ? 340 : 400),
  );
  const canvasHeight = 200;

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(
        width ?? (window.innerWidth <= 400 ? 250 : window.innerWidth <= 767 ? 340 : 400),
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {
    if (signature !== '') {
      const base64 = svgToBase64(signature);
      ref.current.fromDataURL(base64);
    }
  }, [signature]);

  const ref = useRef(null);

  const clearCanvas = () => {
    ref.current.clear();
    setSignature('');
  };

  const saveCanvas = () => {
    if (ref.current.isEmpty()) return;

    const newStrokes = ref.current.toData();

    if (newStrokes.length === 0) return;

    let finalStrokes = newStrokes;

    if (signature) {
      const oldStrokes = svgPathToPoints(signature);
      finalStrokes = [...oldStrokes, ...newStrokes];
    }

    const svg = convertPointsToSVG(finalStrokes, canvasWidth, canvasHeight);
    setSignature(svg);
  };

  return (
    <React.Fragment>
      {label && <label className="login_label labelName d-block text-start">{label}</label>}
      <div className="image-container" aria-disabled="true">
        <SignatureCanvas
          ref={ref}
          dotSize={2}
          penColor="white"
          trailingStroke={true}
          lineWidth={3}
          onEnd={saveCanvas}
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            className: 'sigCanvas',
          }}
        />

        <CIcon
          icon={cilX}
          title="Clear"
          className="canvas-icon ms-4"
          size="xl"
          onClick={clearCanvas}
        />
      </div>
    </React.Fragment>
  );
};
export default SignatureBoard;
