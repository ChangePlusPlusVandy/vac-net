// firebase.ts
// Description: Imports the Firebase configurations and uses it to initialize the Firebase SDK.
// Exports auth to be used in other files.

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: "vac-net",
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_x509_CERT_URL,
  universe_domain: "googleapis.com",
};

const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const auth = getAuth(app);

export { auth };
