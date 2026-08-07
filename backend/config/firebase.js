// config/firebase.js
//
// Initializes the Firebase Admin SDK and exports a single shared Firestore
// instance. This is the ONLY place in the app that touches firebase-admin
// directly — every model file gets its collection references from here.
//
// CREDENTIALS: Supply your service account key one of two ways:
//   1) Put the full JSON contents in the FIREBASE_SERVICE_ACCOUNT env var
//      (as a one-line JSON string), OR
//   2) Save the downloaded key file as config/serviceAccountKey.json
//      (this path is gitignored — never commit it).

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT env var is not valid JSON. Make sure the whole key file contents are on one line.'
      );
    }
  }

  const keyFilePath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(keyFilePath)) {
    return require(keyFilePath);
  }

  throw new Error(
    'No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT in .env, or place your key at backend/config/serviceAccountKey.json.'
  );
}

let app;
if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

const db = admin.firestore();

module.exports = { admin, db };
