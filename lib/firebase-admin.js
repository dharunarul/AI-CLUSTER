import admin from "firebase-admin";

function getApp() {
  if (admin.apps.length) return admin.apps[0];

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is not set. Ensure environment variables are configured."
    );
  }

  const cleanedKey = privateKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: cleanedKey,
    }),
  });

  return admin.apps[0];
}

let cachedAuth = null;
let cachedDb = null;

export function getAdminAuth() {
  if (!cachedAuth) {
    getApp();
    cachedAuth = admin.auth();
  }
  return cachedAuth;
}

export function getAdminDb() {
  if (!cachedDb) {
    getApp();
    cachedDb = admin.firestore();
  }
  return cachedDb;
}
