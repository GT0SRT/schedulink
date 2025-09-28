import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanComplete, onClose }) => {
  const [scannedData, setScannedData] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isScannerRunning = useRef(false);

  useEffect(() => {
    // Request location permission and fetch once on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(loc);
          console.log("Location fetched:", loc);
        },
        (err) => {
          console.warn("Location permission denied or unavailable", err);
          setError("Location permission denied or unavailable");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation not supported by this browser.");
    }

    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrCode
            .start(
              cameraId,
              {
                fps: 10,
                qrbox: { width: window.innerWidth, height: window.innerHeight },
                aspectRatio: window.innerWidth / window.innerHeight,
              },
              (decodedText) => {
                setScannedData(decodedText);
                setError("");
                if (onScanComplete) onScanComplete(decodedText, location);
                // Keep scanning unless parent hides this component
              },
              (err) => {
                // Optionally handle scan failure per frame
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
        setError("Camera permission denied or no camera available");
      });

    // Cleanup on unmount
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
    <div className="relative w-screen h-screen bg-black flex flex-col justify-center items-center">
      {/* Close Button */}
      <button
        onClick={() => onClose && onClose()}
        className="absolute top-6 right-6 z-50 bg-black bg-opacity-50 text-white p-3 rounded-full text-xl font-bold"
        aria-label="Close scanner"
      >
        ✕
      </button>

      {/* QR Reader container */}
      <div
        id="qr-reader"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      ></div>

      {/* Scanned data and location display */}
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