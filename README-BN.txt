আমি মুসলিম | Islamic Life
================================

এই ZIP-এ আগের GitHub-ready প্রকল্পের একই ফোল্ডার কাঠামো রাখা হয়েছে।

ফাইলসমূহ:
- public/index.html
- public/style.css
- public/app.js
- public/manifest.json
- public/sw.js
- public/firebase-config.js
- public/firebase-push.js
- public/icon-512.png
- public/creator.jpg
- public/creator-photo-note.txt

গুরুত্বপূর্ণ:
1. GitHub Pages/Vercel-এ deploy করার সময় public ফোল্ডারের ভেতরের ফাইলগুলো সঠিক publish root-এ রাখুন।
2. Firebase Authentication/Firestore/FCM পুরোপুরি চালু করতে Firebase Console-এর প্রকৃত project settings, authorized domains এবং নিরাপত্তা rules যাচাই করতে হবে।
3. Prayer times, Hijri date, Quran data/audio ও geolocation-এর জন্য ইন্টারনেট/ব্রাউজার permission প্রয়োজন।
4. কিবলার কোণ গণনা করা হয়; ফোনের compass sensor integration আলাদা বিষয়।
5. এই ZIP-এ creator.jpg আগের project archive থেকে অক্ষত রাখা হয়েছে। ছবিটি বদলাতে চাইলে নিজের অনুমোদিত portrait দিয়ে একই নামের ফাইল প্রতিস্থাপন করুন।
6. নামাজের নিয়ত মূলত অন্তরের ইচ্ছা; প্রচলিত বাংলা উচ্চারণকে বাধ্যতামূলক মনে করবেন না। নামাজের পদ্ধতি/ফিকহি বিষয়ে নির্ভরযোগ্য আলেমের পরামর্শ নিন।

পরীক্ষা:
- app.js JavaScript syntax check করা হয়েছে।
- manifest.json JSON parse check করা হয়েছে।
- HTML-এর app.js/style.css/manifest/service worker references পরীক্ষা করা হয়েছে।
- বাহ্যিক API, Firebase project credentials, FCM delivery, browser permissions এবং live deployment এখানে end-to-end পরীক্ষা করা হয়নি।
