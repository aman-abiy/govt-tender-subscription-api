import admin from 'firebase-admin';

var serviceAccount = require('../config/alpha_tenders_firebase_adminsdk_service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin