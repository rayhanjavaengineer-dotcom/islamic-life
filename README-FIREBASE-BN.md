# Islamic Life — GitHub Pages ও Firebase সেটআপ

1. ZIP Extract করুন। আপনার পুরোনো GitHub repository-তে `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, `firebase-push.js` আপডেট করুন।
2. ZIP-এর `firebase-config.js`-এ placeholder আছে। আগের repository-র আসল Firebase Web config ও VAPID Public Key কপি করে বসাতে হবে। Project ID: `islamic-life-d6bdc`।
3. `icon-192.png`, `icon-512.png`, `creator.jpg` আগের repository থেকে মুছবেন না; এই ZIP-এ সেগুলো অন্তর্ভুক্ত নয়।
4. Firebase Auth চালু করতে Console > Authentication > Sign-in method থেকে Email/Password enable করুন। Phone OTP-এর জন্য Phone provider, authorized domain, reCAPTCHA ও SMS quota/billing দরকার। এই build-এ সম্পূর্ণ Phone OTP UI/flow নেই।
5. FCM token client-এ তৈরি হতে পারে, কিন্তু নির্দিষ্ট নামাজের সময়ে স্বয়ংক্রিয় Push পাঠাতে Cloud Functions/নিরাপদ backend, token database ও scheduler দরকার। Service Account private key কখনো public GitHub বা frontend-এ রাখবেন না।
6. Prayer times AlAdhan API Method 1 (Karachi) ব্যবহার করে; স্থানীয় calculation method ও মসজিদের সময় ভিন্ন হতে পারে। Hijri date চাঁদ দেখার কারণে ভিন্ন হতে পারে। কুরআন ও API audio-র জন্য ইন্টারনেট লাগে।
7. যাকাতের হিসাব আনুমানিক; নিসাব, হাওল, সম্পদ ও ঋণ যাচাই করে আলেমের পরামর্শ নিন। ইতিহাসের তথ্য সংক্ষিপ্ত পরিচিতি, পূর্ণাঙ্গ ইতিহাসগ্রন্থ নয়।

## গবেষণার জন্য পাঠসূত্র
- কুরআন ও প্রাসঙ্গিক নির্ভরযোগ্য তাফসির
- Ibn Sa'd, *Kitab al-Tabaqat al-Kabir*
- al-Baladhuri, *Futuh al-Buldan*
- Adam J. Silverstein, *Islamic History: A Very Short Introduction*
- MIT Libraries, Early Arabic Sources for the History of Islam

ঐতিহাসিক বর্ণনা কুরআন/সহিহ হাদিসের সমতুল্য নয়; উৎস ও মতভেদ আলাদা করে যাচাই করতে হবে।
