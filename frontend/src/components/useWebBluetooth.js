// src/hooks/useWebBluetooth.js
import { useState, useEffect } from 'react';

export const useWebBluetooth = () => {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectToDevice = async (serviceUuid) => {
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth is not supported in this browser.");
      return;
    }

    try {
      // Request a device with a specific service UUID
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUuid] }],
      });
      setDevice(device);

      const gattServer = await device.gatt.connect();
      setServer(gattServer);
      setIsConnected(true);

      // Handle disconnects
      device.addEventListener('gattserverdisconnected', () => {
        console.log('Device disconnected.');
        setIsConnected(false);
      });

    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnectFromDevice = () => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    }
  };
  
  // Expose the connection state and functions for your component
  return { connectToDevice, disconnectFromDevice, isConnected, device, server };
};