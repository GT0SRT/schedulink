const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const SECRET = process.env.TOKEN_SECRET || 'dev_secret';
const TTL = parseInt(process.env.TOKEN_TTL_SECONDS || '300', 10); // seconds

function signSessionPayload(sessionId, ts) {
  // payload: sessionId|ts
  const msg = `${sessionId}|${ts}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(msg).digest('hex');
  const payload = Buffer.from(`${sessionId}|${ts}|${hmac}`).toString('base64');
  return payload;
}

function verifySessionPayload(payloadBase64) {
  try {
    const decoded = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const [sessionId, tsStr, sig] = decoded.split('|');
    if (!sessionId || !tsStr || !sig) return { valid: false, reason: 'malformed' };
    const ts = parseInt(tsStr, 10);
    const now = Math.floor(Date.now()/1000);
    if (Math.abs(now - ts) > TTL) return { valid: false, reason: 'expired' };
    const msg = `${sessionId}|${ts}`;
    const expected = crypto.createHmac('sha256', SECRET).update(msg).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(expected,'hex'), Buffer.from(sig,'hex'))) {
      return { valid: false, reason: 'bad_sig' };
    }
    return { valid: true, sessionId, ts };
  } catch (err) {
    return { valid: false, reason: 'error', error: err.message };
  }
}

function newSessionId() {
  return uuidv4();
}

module.exports = { signSessionPayload, verifySessionPayload, newSessionId };