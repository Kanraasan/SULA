require('dotenv').config();
const jwt = require('jsonwebtoken');
const http = require('http');

const JWT_SECRET = process.env.JWT_SECRET;
const token = jwt.sign({ 
  id: '966051f6-944e-4283-be60-87f26bcff306',
  email: 'kanratest@example.com',
  username: 'KanraGanteng',
  role: 'user',
  nik: '1234123412341234'
}, JWT_SECRET, { expiresIn: '1d' });

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

const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
const CRLF = '\r\n';

const parts = [];
parts.push(`--${boundary}${CRLF}`);
parts.push(`Content-Disposition: form-data; name="title"${CRLF}${CRLF}`);
parts.push(`Testing dari Form UI${CRLF}`);

parts.push(`--${boundary}${CRLF}`);
parts.push(`Content-Disposition: form-data; name="category"${CRLF}${CRLF}`);
parts.push(`infrastruktur${CRLF}`);

parts.push(`--${boundary}${CRLF}`);
parts.push(`Content-Disposition: form-data; name="description"${CRLF}${CRLF}`);
parts.push(`Deskripsi panjang ini dikirimkan via UI form formData.append${CRLF}`);

parts.push(`--${boundary}${CRLF}`);
parts.push(`Content-Disposition: form-data; name="userNik"${CRLF}${CRLF}`);
parts.push(`1234123412341234${CRLF}`);

parts.push(`--${boundary}${CRLF}`);
parts.push(`Content-Disposition: form-data; name="username"${CRLF}${CRLF}`);
parts.push(`KanraGanteng${CRLF}`);

parts.push(`--${boundary}${CRLF}`);
parts.push(`Content-Disposition: form-data; name="lampiranFoto"; filename="fotoFromUI.png"${CRLF}`);
parts.push(`Content-Type: image/png${CRLF}${CRLF}`);

const bodyStart = Buffer.from(parts.join(''));
const bodyEnd = Buffer.from(`${CRLF}--${boundary}--${CRLF}`);
const body = Buffer.concat([bodyStart, pngData, bodyEnd]);

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/report',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': body.length
  }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', data);
  });
});

req.on('error', e => console.error(e));
req.write(body);
req.end();
