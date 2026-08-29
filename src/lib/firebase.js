import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import content from "../content";

// Firebase Configuration:
// Reads from Vite environment variables (.env / .env.local) or falls back to content.js integrations
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || content.integrations?.firebase?.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || content.integrations?.firebase?.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || content.integrations?.firebase?.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || content.integrations?.firebase?.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || content.integrations?.firebase?.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || content.integrations?.firebase?.appId || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;
if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
  }
}

export { db };

/**
 * Subscribe to real-time blessings updates from Firestore.
 * Automatically updates when any guest adds a blessing or reacts with a heart.
 */
export function subscribeToBlessings(onData, onError) {
  if (!db) return () => {};

  const q = query(collection(db, "blessings"), orderBy("timestamp", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const blessings = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || "",
          message: data.message || "",
          side: data.side || "",
          hearts: typeof data.hearts === "number" ? data.hearts : 1,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp || new Date().toISOString(),
        };
      });
      onData(blessings);
    },
    (error) => {
      console.error("Firestore blessings subscription error:", error);
      if (onError) onError(error);
    }
  );
}

/**
 * Post a new blessing to Firestore
 */
export async function addBlessingToFirestore({ name, message, side }) {
  if (!db) throw new Error("Firebase is not configured");
  return addDoc(collection(db, "blessings"), {
    name,
    message,
    side,
    hearts: 1,
    timestamp: serverTimestamp(),
  });
}

/**
 * Atomically increment or decrement heart count on a blessing
 */
export async function updateBlessingHearts(blessingId, delta = 1) {
  if (!db || !blessingId) return;
  const docRef = doc(db, "blessings", blessingId);
  return updateDoc(docRef, {
    hearts: increment(delta),
  });
}

/**
 * Submit an RSVP to Firestore
 */
export async function addRSVPToFirestore(rsvpData) {
  if (!db) throw new Error("Firebase is not configured");
  return addDoc(collection(db, "rsvps"), {
    ...rsvpData,
    timestamp: serverTimestamp(),
  });
}
