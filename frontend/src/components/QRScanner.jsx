import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanComplete, onClose }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const isRunning = useRef(false);

  // Store onScanComplete in ref to avoid useEffect dependency issues
  const onScanCompleteRef = useRef(onScanComplete);
  useEffect(() => {
    onScanCompleteRef.current = onScanComplete;
  }, [onScanComplete]);

  useEffect(() => {
    const qrRegionId = "inline-qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || devices.length === 0) {
          throw new Error("No cameras found.");
        }

        const backCamera =
          devices.find((d) => /back|rear/i.test(d.label)) || devices[0];

        html5QrCode
          .start(
            backCamera.id,
            {
              fps: 10,
              // No qrbox option here to remove scanning box
              aspectRatio: window.innerWidth / window.innerHeight,
            },
            (decodedText) => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const loc = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                  };
                  onScanCompleteRef.current(decodedText, loc);
                },
                () => {
                  onScanCompleteRef.current(decodedText, null);
                }
              );
            },
            (scanError) => {
              // Optional: handle scan errors if needed
            }
          )
          .then(() => {
            isRunning.current = true;
          })
          .catch((err) => {
            console.error("Failed to start QR code scanner", err);
          });
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });

    return () => {
      if (html5QrCodeRef.current && isRunning.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch(() => {});
        isRunning.current = false;
      }
    };
  }, []); // empty dependency array now safe

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* CSS overrides */}
      <style>{`
        /* Hide scanning box and overlays */
        .html5-qrcode-box,
        .html5-qrcode-scanning-region canvas,
        .html5-qrcode-overlay {
          display: none !important;
        }

        /* Make video fill container cleanly */
        #inline-qr-reader video {
          object-fit: cover !important;
          filter: none !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>

      <div
        id="inline-qr-reader"
        className="w-full aspect-square border border-gray-300 rounded-md overflow-hidden"
        ref={scannerRef}
      />
      {/* <button
        onClick={onClose}
        className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg"
      >
        Cancel
      </button> */}
    </div>
  );
};

export default QRScanner;
