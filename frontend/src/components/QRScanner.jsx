import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanComplete, onClose }) => {
  const [scannedData, setScannedData] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isScannerRunning = useRef(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          setError("Location permission denied or unavailable");
        },
        { enableHighAccuracy: true }
      );
    }

    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        const backCamera =
          devices.find((d) => /back|rear/i.test(d.label)) ||
          devices[devices.length - 1];

        const viewportWidth = window.innerWidth;
        const qrboxSize = Math.floor(viewportWidth * 0.6); // 60% of screen width

        html5QrCode
          .start(
            backCamera.id,
            {
              fps: 10,
              qrbox: { width: qrboxSize, height: qrboxSize },
              aspectRatio: window.innerWidth / window.innerHeight,
            },
            (decodedText) => {
              setScannedData(decodedText);
              if (onScanComplete) onScanComplete(decodedText, location);
            },
            (err) => {
              // Scan frame error
            }
          )
          .then(() => {
            isScannerRunning.current = true;
          })
          .catch((err) => {
            setError("Failed to start scanning: " + err);
          });
      })
      .catch(() => {
        setError("Camera permission denied or not available");
      });

    return () => {
      if (html5QrCodeRef.current && isScannerRunning.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch(() => {});
        isScannerRunning.current = false;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center">
      {/* Close Button */}
      <button
        onClick={() => onClose && onClose()}
        className="absolute top-6 right-6 z-50 bg-black bg-opacity-50 text-white p-3 rounded-full text-xl font-bold"
        aria-label="Close scanner"
      >
        ✕
      </button>

      {/* QR Reader Fullscreen */}
      <div
        id="qr-reader"
        className="w-full h-full absolute top-0 left-0 z-0"
        style={{ overflow: "hidden" }}
      />

      {/* Square overlay box like UPI */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-[60vw] max-w-[300px] aspect-square">
            {/* Box outline */}
            <div className="absolute inset-0 shadow-xl z-30"></div>

            {/* Dark overlay around the box */}
            <div className="absolute inset-0 z-10">
              <div className="w-full h-full backdrop-brightness-50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Result */}
      {scannedData && (
        <div className="absolute bottom-24 bg-green-800 bg-opacity-70 text-white p-4 rounded max-w-xs text-center z-30">
          Scanned: {scannedData}
          {location && (
            <div className="text-xs mt-1">
              📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute bottom-24 bg-red-700 bg-opacity-70 text-white p-4 rounded max-w-xs text-center z-30">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;