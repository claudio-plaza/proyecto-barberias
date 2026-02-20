import admin from "firebase-admin";

const isAdminConfigured = !!process.env.FIREBASE_PROJECT_ID && !!process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length && isAdminConfigured) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminDb = isAdminConfigured ? admin.firestore() : null;
const adminAuth = isAdminConfigured ? admin.auth() : null;
const adminStorage = isAdminConfigured ? admin.storage() : null;

export { adminDb, adminAuth, adminStorage, isAdminConfigured };
