
const express = require("express");
const QRCode = require("qrcode");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const qrData = await QRCode.toDataURL("Hello from EduSmart!");
    res.json({ qr: qrData });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

module.exports = router;
