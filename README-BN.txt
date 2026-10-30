আমি মুসলিম | Islamic Life

ব্যবহার:
1) ZIP extract করুন।
2) public ফোল্ডারের ফাইলগুলো আপনার GitHub repository-এর public ফোল্ডারে আপলোড করুন।
3) creator.jpg আপাতত অ্যাপের লোগো দিয়ে রাখা হয়েছে। নিজের আসল portrait দিতে public/creator.jpg ফাইলটি বদলে দিন।
4) Firebase login ও push notification চালু করতে public/firebase-config.js-এ নিজের Firebase project config বসাতে হবে এবং Firebase Authentication/Cloud Messaging সেটআপ করতে হবে।
5) HTTPS hosting (যেমন Vercel) থেকে চালালে PWA install/service worker কাজ করবে।

গুরুত্বপূর্ণ: Firebase credentials এখানে placeholder; বাস্তব authentication/push কাজ করবে না যতক্ষণ নিজের Firebase config ও backend/FCM setup না করা হয়।
