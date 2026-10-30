# Islamic Life Premium 2.0 — Firebase Push সেটআপ (বাংলা)

এই আপডেটে Firebase Cloud Messaging-এর browser registration scaffold যোগ হয়েছে। শুধু এই ফাইল আপলোড করলেই background prayer alerts চালু হবে না। নিচের ধাপগুলো সম্পন্ন করতে হবে।

## ১) Firebase project তৈরি
1. https://console.firebase.google.com/ খুলে Google account দিয়ে project তৈরি করো।
2. Project settings → General → Your apps → Web app (</>) যোগ করো।
3. পাওয়া `firebaseConfig`-এর মান `firebase-config.js`-এ বসাও।
4. Project settings → Cloud Messaging → Web Push certificates থেকে VAPID key pair তৈরি করে public key `firebase-config.js`-এর `firebaseVapidKey`-এ বসাও।
5. Firebase Console → Cloud Messaging-এ Web configuration/FCM সক্রিয় আছে নিশ্চিত করো।

## ২) Background worker config
`sw.js`-এর `FIREBASE_WEB_CONFIG` অংশে একই Web App config বসাও। এই PWA-এর offline cache এবং Firebase background message একই service worker-এ রাখা হয়েছে, যাতে একই root scope-এ দ্বিতীয় worker পুরোনোটিকে replace না করে।

## ৩) Scheduled prayer push backend (এখনো প্রয়োজন)
Browser token তৈরি ও local preference save হয়। কিন্তু নামাজের সময় server push পাঠাতে নিরাপদ backend আবশ্যক। Firebase Cloud Functions (বা সমমানের trusted server) তৈরি করে: 
- FCM token authenticated user/device-এর সঙ্গে সংরক্ষণ করবে;
- শহর, timezone, prayer timings ও enabled prayers অনুযায়ী schedule তৈরি করবে;
- নির্বাচিত 0/5/10 মিনিট reminder-এ FCM message পাঠাবে;
- invalid/expired token মুছে দেবে;
- user preference পরিবর্তন/opt-out মানবে।

**Service-account private key, Admin SDK credential বা server secret কখনো GitHub-এর public repository, HTML বা JavaScript-এ রাখবে না।** Backend source/secret শুধু Firebase Functions secret/config ব্যবস্থায় থাকবে।

## ৪) পরীক্ষা
- GitHub Pages HTTPS-এ deploy করো।
- Android Chrome-এ site খুলে Add to Home screen / Install করো।
- Notification permission Allow করো।
- Firebase console/backend থেকে test push পাঠিয়ে background notification পরীক্ষা করো।

## অডিও সীমাবদ্ধতা
Web Push notification-এর নিজস্ব sound Android/Chrome/OS নিয়ন্ত্রণ করে। Background notification থেকে স্বয়ংক্রিয়ভাবে সম্পূর্ণ আজান MP3 বাজানো সাধারণ browser/PWA-তে নির্ভরযোগ্যভাবে সম্ভব নয় এবং autoplay restriction আছে। এই build-এ sound preference সংরক্ষিত হয়; সম্পূর্ণ আজান অডিওর foreground playback বা native Android app path আলাদাভাবে তৈরি ও পরীক্ষা করতে হবে।

## বর্তমান পর্যায়ের অবস্থা
- Added: prayer notification preference UI; FCM browser registration/token retrieval scaffold; existing service worker-এ background message handler; notification click opens prayer section; cache version bump.
- Still required: replace Firebase placeholders; deploy trusted scheduled Cloud Function; securely store tokens; end-to-end Android device test.
- Other Premium 2.0 modules (full tafsir/search, verified biography library, full surah playlist, advanced nisab/haul zakat, full Arabic RTL translation, true Ramadan 30-day calendar/countdowns) remain staged work and are not represented as completed in this build.
