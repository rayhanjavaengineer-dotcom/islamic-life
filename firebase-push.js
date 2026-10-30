/* Firebase Cloud Messaging web setup (client-side).
   This registers the device and obtains an FCM token. A trusted backend/Cloud Function
   is still required to send scheduled prayer notifications to saved tokens. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getMessaging, getToken, isSupported } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js";
import { firebaseConfig, firebaseVapidKey, firebaseIsConfigured } from "./firebase-config.js";

const status = (message) => { const el = document.getElementById("firebasePushStatus"); if (el) el.textContent = message; };
const PREF_KEY = "il-azan-preferences-v2";
const TOKEN_KEY = "il-fcm-token-v1";
const readPrefs = () => { try { return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch { return {}; } };
const savePrefs = () => {
  const prayers = [...document.querySelectorAll("[data-prayer-notify]")].reduce((o, el) => (o[el.dataset.prayerNotify] = el.checked, o), {});
  const prefs = { prayers, reminder: Number(document.getElementById("azanReminder")?.value || 0), sound: document.getElementById("azanSound")?.value || "both" };
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); status("নোটিফিকেশন পছন্দ এই ডিভাইসে সংরক্ষিত হয়েছে।");
};
const restorePrefs = () => { const p=readPrefs(); document.querySelectorAll("[data-prayer-notify]").forEach(el=>{if(p.prayers && p.prayers[el.dataset.prayerNotify] !== undefined) el.checked=!!p.prayers[el.dataset.prayerNotify];}); if(p.reminder!==undefined && document.getElementById("azanReminder")) document.getElementById("azanReminder").value=String(p.reminder); if(p.sound && document.getElementById("azanSound")) document.getElementById("azanSound").value=p.sound; };
restorePrefs(); document.getElementById("saveAzanPrefs")?.addEventListener("click", savePrefs);

document.getElementById("azanNotifyBtn")?.addEventListener("click", async () => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) { status("এই ব্রাউজারে Web Push সমর্থিত নয়। Android Chrome-এ ইনস্টল করা PWA দিয়ে চেষ্টা করো।"); return; }
  if (!firebaseIsConfigured) { status("প্রথমে firebase-config.js-এ Firebase Web App config ও VAPID public key বসাতে হবে। Firebase Console-এর ধাপ README-FIREBASE-BN.md-এ আছে।"); return; }
  try {
    const permission = await Notification.requestPermission(); if(permission !== "granted") { status("Notification permission দেওয়া হয়নি। Chrome site settings থেকে Allow করো।"); return; }
    if (!(await isSupported())) { status("এই browser/device-এ Firebase Messaging সমর্থিত নয়।"); return; }
    const app = initializeApp(firebaseConfig); const messaging = getMessaging(app);
    const registration = await navigator.serviceWorker.register("./sw.js");
    const readyRegistration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, { vapidKey: firebaseVapidKey, serviceWorkerRegistration: readyRegistration || registration });
    if (!token) { status("FCM token পাওয়া যায়নি। VAPID key ও Firebase Cloud Messaging সেটিংস যাচাই করো।"); return; }
    localStorage.setItem(TOKEN_KEY, token); savePrefs();
    status("এই ডিভাইস Firebase Push-এর জন্য নিবন্ধিত হয়েছে। পরবর্তী ধাপ: token নিরাপদ backend/Cloud Function-এ সংরক্ষণ করে নামাজের সময় Push পাঠানোর ব্যবস্থা করতে হবে।");
  } catch (error) { console.error("Firebase Push setup error", error); status("Firebase setup ব্যর্থ: "+(error?.message || "configuration পরীক্ষা করো")); }
});
