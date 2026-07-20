import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getApp() {
  if (admin.getApps().length) return admin.getApps()[0];

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is not set. Ensure environment variables are configured."
    );
  }

  const cleanedKey = privateKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "");

  admin.initializeApp({
    credential: admin.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: cleanedKey,
    }),
  });

  return admin.getApps()[0];
}

let cachedAuth = null;
let cachedDb = null;

export function getAdminAuth() {
  if (!cachedAuth) cachedAuth = getAuth(getApp());
  return cachedAuth;
}

export function getAdminDb() {
  if (!cachedDb) cachedDb = getFirestore(getApp());
  return cachedDb;
}
