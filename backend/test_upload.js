require('dotenv').config();
const jwt = require('jsonwebtoken');
const http = require('http');

const JWT_SECRET = process.env.JWT_SECRET;
console.log('Using JWT_SECRET from .env:', JWT_SECRET ? 'YES (length=' + JWT_SECRET.length + ')' : 'MISSING!');

const token = jwt.sign({ 
  id: '966051f6-944e-4283-be60-87f26bcff306',
  email: 'kanratest@example.com',
  username: 'KanraGanteng',
  role: 'user' 
}, JWT_SECRET, { expiresIn: '1d' });

// Create a minimal PNG file (1x1 pixel)
const pngData = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
  0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
  0x54, 0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02,
  0x00, 0x01, 0xE5, 0x27, 0xDE, 0xFC, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42,
  0x60, 0x82
]);

// ========== TEST 1: WITH FILE ==========
console.log('\n=== Test 1: With file ===');
const boundary1 = '----FormBoundary' + Math.random().toString(36).slice(2);
const CRLF = '\r\n';

const parts1 = [];
parts1.push(`--${boundary1}${CRLF}`);
parts1.push(`Content-Disposition: form-data; name="title"${CRLF}${CRLF}`);
parts1.push(`Testing Upload Report${CRLF}`);
parts1.push(`--${boundary1}${CRLF}`);
parts1.push(`Content-Disposition: form-data; name="category"${CRLF}${CRLF}`);
parts1.push(`infrastruktur${CRLF}`);
parts1.push(`--${boundary1}${CRLF}`);
parts1.push(`Content-Disposition: form-data; name="description"${CRLF}${CRLF}`);
parts1.push(`Ini adalah deskripsi test yang lebih dari 10 karakter${CRLF}`);
parts1.push(`--${boundary1}${CRLF}`);
parts1.push(`Content-Disposition: form-data; name="lampiranFoto"; filename="test.png"${CRLF}`);
parts1.push(`Content-Type: image/png${CRLF}${CRLF}`);

const bodyStart1 = Buffer.from(parts1.join(''));
const bodyEnd1 = Buffer.from(`${CRLF}--${boundary1}--${CRLF}`);
const body1 = Buffer.concat([bodyStart1, pngData, bodyEnd1]);

console.log('Body size:', body1.length, 'bytes');

const req1 = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/report',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'multipart/form-data; boundary=' + boundary1,
    'Content-Length': body1.length
  },
  timeout: 15000
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    runTest2();
  });
});
req1.on('error', e => { console.error('Request error:', e.message); runTest2(); });
req1.on('timeout', () => { console.log('TIMEOUT!'); req1.destroy(); runTest2(); });
req1.write(body1);
req1.end();

// ========== TEST 2: WITHOUT FILE ==========
function runTest2() {
  console.log('\n=== Test 2: Without file ===');
  const boundary2 = '----FormBoundary' + Math.random().toString(36).slice(2);
  const parts2 = [];
  parts2.push(`--${boundary2}${CRLF}`);
  parts2.push(`Content-Disposition: form-data; name="title"${CRLF}${CRLF}`);
  parts2.push(`Testing Without Photo${CRLF}`);
  parts2.push(`--${boundary2}${CRLF}`);
  parts2.push(`Content-Disposition: form-data; name="category"${CRLF}${CRLF}`);
  parts2.push(`infrastruktur${CRLF}`);
  parts2.push(`--${boundary2}${CRLF}`);
  parts2.push(`Content-Disposition: form-data; name="description"${CRLF}${CRLF}`);
  parts2.push(`Ini adalah deskripsi test tanpa foto lebih dari sepuluh karakter${CRLF}`);
  parts2.push(`--${boundary2}--${CRLF}`);
  
  const body2 = Buffer.from(parts2.join(''));
  
  const req2 = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/report',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data; boundary=' + boundary2,
      'Content-Length': body2.length
    },
    timeout: 15000
  }, (res2) => {
    let data = '';
    res2.on('data', c => data += c);
    res2.on('end', () => {
      console.log('Status:', res2.statusCode);
      console.log('Response:', data);
    });
  });
  req2.on('error', e => console.error('Request error:', e.message));
  req2.on('timeout', () => { console.log('TIMEOUT!'); req2.destroy(); });
  req2.write(body2);
  req2.end();
}
