
"use strict";
// Firebase Messaging shares this existing PWA worker so the app's offline cache worker
// is not replaced by a second service worker with the same root scope.
const FIREBASE_WEB_CONFIG = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID"
};
const FIREBASE_PUSH_READY = Object.values(FIREBASE_WEB_CONFIG).every(v => typeof v === "string" && !v.startsWith("PASTE_") && !v.includes("YOUR_PROJECT_ID"));
if (FIREBASE_PUSH_READY) {
  importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");
  firebase.initializeApp(FIREBASE_WEB_CONFIG);
  const firebaseMessaging = firebase.messaging();
  firebaseMessaging.onBackgroundMessage(payload => {
    const title = payload.notification?.title || "নামাজের সময় হয়েছে";
    self.registration.showNotification(title, {
      body: payload.notification?.body || "আপনার নামাজের সময়ের স্মরণবার্তা।",
      icon: "./icon-192.png", badge: "./icon-192.png",
      data: { url: payload.data?.url || "./index.html#prayer" },
      tag: payload.data?.tag || "islamic-life-prayer", renotify: false
    });
  });
}
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./index.html#prayer", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const client of list) if (client.url.startsWith(self.location.origin) && "focus" in client) { client.navigate(target); return client.focus(); }
    return clients.openWindow(target);
  }));
});


const CACHE_NAME = "islamic-life-v3";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./creator.jpg",
  "./icon-192.png",
  "./icon-512.png"
];

// অ্যাপ ইনস্টল করার সময় প্রয়োজনীয় ফাইল ক্যাশ করা
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        const required = APP_FILES.filter(file => !file.includes("creator.jpg") && !file.includes("icon-"));
        await cache.addAll(required);
        await Promise.all(APP_FILES.filter(file => file.includes("creator.jpg") || file.includes("icon-")).map(file => cache.add(file).catch(() => null)));
      })
      .then(() => self.skipWaiting())
  );
});

// পুরোনো ভার্সনের ক্যাশ সরানো
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// একই অরিজিনের অ্যাপ ফাইল ক্যাশ থেকে দেখানো
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // বাহ্যিক API ও অডিওকে এই ক্যাশে সংরক্ষণ করা হবে না
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then(response => {
        if (
          response &&
          response.ok &&
          response.type === "basic"
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      }).catch(() => {
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("ইন্টারনেট সংযোগ নেই।", {
          status: 503,
          statusText: "Offline"
        });
      });
    })
  );
});
