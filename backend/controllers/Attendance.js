const QRCode = require('qrcode');
const Class = require('../models/Class');

class Attendance {
    generateQr = async (req, res) => {
      const { classId } = req.params;
      const { location } = req.body;
    
      if (!location || !location.lat || !location.lng) {
        return res.status(400).json({ error: 'Location (lat/lng) is required' });
      }
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
          return res.status(404).json({ error: 'Class not found' });
        }
    
        const qrPayload = JSON.stringify({
          classId,
          generatedAt: new Date().toISOString(),
        });
    
        const qrCodeDataURL = await QRCode.toDataURL(qrPayload);
    
        classDoc.qrCode = qrCodeDataURL;
        classDoc.qrLocation = {
          lat: location.lat,
          lng: location.lng,
        };
    
        await classDoc.save();
    
        res.status(200).json({ success: true, qrCode: qrCodeDataURL });
    };
}

export default new Attendance();