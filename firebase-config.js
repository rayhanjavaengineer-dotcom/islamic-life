/* Firebase Web App configuration template.
   Replace every placeholder with values from Firebase Console > Project settings > Your apps.
   The web config and VAPID public key are not server secrets. Never put service-account private keys here. */
export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID"
};
export const firebaseVapidKey = "PASTE_WEB_PUSH_CERTIFICATE_KEY_PAIR_PUBLIC_KEY";
export const firebaseIsConfigured = Object.values(firebaseConfig).every(v => typeof v === "string" && !v.startsWith("PASTE_") && !v.includes("YOUR_PROJECT_ID")) && !firebaseVapidKey.startsWith("PASTE_");
