import React, { useState } from 'react';
import axios from 'axios';

function Test() {
  const [qrImage, setQrImage] = useState(null);
  const [classCode, setClassCode] = useState('');
  const [teacherLocation, setTeacherLocation] = useState(null);

  const startClass = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setTeacherLocation({ latitude, longitude });

      const res = await axios.post('http://localhost:3000/api/start-class', {
        teacherLatitude: latitude,
        teacherLongitude: longitude
      });

      setQrImage(res.data.qrImage);
      setClassCode(res.data.classCode);
    }, () => {
      alert('Permission to access location denied.');
    });
  };

  return (
    <div>
      <h2>Teacher Panel</h2>
      <button onClick={startClass}>Start Class</button>
      {qrImage && <img src={qrImage} alt="Class QR Code" />}
      {classCode && <p>Class Code: {classCode}</p>}
    </div>
  );
}

export default Test;
