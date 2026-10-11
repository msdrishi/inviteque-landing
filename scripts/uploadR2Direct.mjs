import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ACCESS_KEY = 'efff4006ef7d1fae9bef4ec7d73ee483';
const SECRET_KEY = '0ba8bda01a4c4d69951a03bdff67e8a837b7d1b9b3d89c92d2fd25883ce12170';
const ENDPOINT_HOST = '396e07bc2d7c2822bcbaf1cb97d92ee6.r2.cloudflarestorage.com';
const BUCKET = 'inviteque-media';
const PUBLIC_URL_BASE = 'https://pub-4ca73fd30e93414984c8221837b12dc5.r2.dev';
const REGION = 'auto';
const SERVICE = 's3';

function hmac(key, string) {
  return crypto.createHmac('sha256', key).update(string).digest();
}

function hash(string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, 'aws4_request');
  return kSigning;
}

export async function uploadFileToR2(filePath, targetKey) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File does not exist: ${fullPath}`);
  }
  const fileBuffer = fs.readFileSync(fullPath);
  const fileName = path.basename(fullPath);
  const key = targetKey || `rajasthani-vows/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  let contentType = 'application/octet-stream';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
  else if (fileName.endsWith('.png')) contentType = 'image/png';
  else if (fileName.endsWith('.webp')) contentType = 'image/webp';
  else if (fileName.endsWith('.mp4')) contentType = 'video/mp4';

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const payloadHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // Headers to sign
  const headers = {
    'content-length': fileBuffer.length.toString(),
    'content-type': contentType,
    'host': ENDPOINT_HOST,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };

  const sortedHeaderKeys = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaderKeys.map(k => `${k}:${headers[k]}\n`).join('');
  const signedHeaders = sortedHeaderKeys.join(';');

  // URL-encode path segments for canonical URI
  const canonicalUri = `/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`;
  const canonicalQuery = '';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    hash(canonicalRequest)
  ].join('\n');

  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, SERVICE);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authorizationHeader = `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `https://${ENDPOINT_HOST}${canonicalUri}`;
  console.log(`Uploading ${fileName} to ${url}...`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      ...headers,
      'Authorization': authorizationHeader,
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`R2 upload failed: ${response.status} ${response.statusText} - ${text}`);
  }

  const publicUrl = `${PUBLIC_URL_BASE}/${key}`;
  console.log(`✅ Success! Public URL: ${publicUrl}`);
  return publicUrl;
}

// If run directly
if (process.argv[1] && process.argv[1].endsWith('uploadR2Direct.mjs') && process.argv[2]) {
  uploadFileToR2(process.argv[2], process.argv[3])
    .then(url => console.log('Final URL:', url))
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}
