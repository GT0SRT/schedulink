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
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(loc);
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
        if (devices && devices.length) {
          // Prefer back camera if available
          const backCamera =
            devices.find((device) => /back|rear/i.test(device.label)) ||
            devices[devices.length - 1];

          html5QrCode
            .start(
              backCamera.id,
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: window.innerWidth / window.innerHeight,
              },
              (decodedText) => {
                setScannedData(decodedText);
                setError("");
                if (onScanComplete) onScanComplete(decodedText, location);
              },
              (err) => {
                // Frame scan error (optional to handle)
              }
            )
            .then(() => {
              isScannerRunning.current = true;
            })
            .catch((err) => {
              setError("Failed to start scanning: " + err);
            });
        } else {
          setError("No cameras found");
        }
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

      {/* QR Reader Container */}
      <div
        id="qr-reader"
        className="w-full h-full"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      />

      {/* Box Overlay (UPI-like scanner box) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Box outline */}
            <div className="absolute inset-0 border-4 border-white rounded-xl shadow-xl"></div>

            {/* Dark overlay around the box */}
            <div className="absolute inset-0">
              <div className="w-full h-full backdrop-brightness-50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan result */}
      {scannedData && (
        <div className="absolute bottom-24 bg-green-800 bg-opacity-70 text-white p-4 rounded max-w-xs text-center">
          Scanned: {scannedData}
          <br />
          {location && (
            <small>
              Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </small>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute bottom-24 bg-red-800 bg-opacity-70 text-white p-4 rounded max-w-xs text-center">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;