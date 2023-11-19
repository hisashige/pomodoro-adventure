import * as admin from "firebase-admin";

let firebaseApp: admin.app.App | null = null;
export function getFirebaseApp() {
  return firebaseApp;
}

const serviceAccount = require("../../serviceAccountKey.json");

export async function initFirebase() {
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    const firestore = admin.firestore();
    firestore.settings({ timestampsInSnapshots: true });
  }
}

export function getFirestore() {
  if (firebaseApp === null) throw new Error("Firestore is not initialized");
  return firebaseApp.firestore();
}
