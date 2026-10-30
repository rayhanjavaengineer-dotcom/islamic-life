
"use strict";

/* =========================================
   ISLAMIC LIFE - SERVICE WORKER
   Firebase Push + PWA Offline Cache
========================================= */

/* 1. FIREBASE CONFIGURATION */

const FIREBASE_WEB_CONFIG = {
  apiKey: "AIzaSyALSfBXa-4LAhDSyPb0B0CixO5rZwzUboBc",
  authDomain: "islamic-life-d6bdc.firebaseapp.com",
  projectId: "islamic-life-d6bdc",
  storageBucket: "islamic-life-d6bdc.firebasestorage.app",
  messagingSenderId: "76264945564",
  appId: "1:76264945564:web:2bcfdf478a1a1f07177a59"
};

const FIREBASE_PUSH_READY =
  Object.values(FIREBASE_WEB_CONFIG).every(
    value =>
      typeof value === "string" &&
      value.length > 0 &&
      !value.startsWith("PASTE_") &&
      !value.includes("YOUR_PROJECT_ID")
  );

/* 2. FIREBASE BACKGROUND MESSAGING */

if (FIREBASE_PUSH_READY) {
  try {
    importScripts(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
    );

    importScripts(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
    );

    firebase.initializeApp(FIREBASE_WEB_CONFIG);

    const firebaseMessaging = firebase.messaging();

    firebaseMessaging.onBackgroundMessage(payload => {
      const title =
        payload.notification?.title ||
        "নামাজের সময় হয়েছে";

      const options = {
        body:
          payload.notification?.body ||
          "আপনার নামাজের সময়ের স্মরণবার্তা।",

        icon: "./icon-192.png",
        badge: "./icon-192.png",

        data: {
          url:
            payload.data?.url ||
            "./index.html#prayer"
        },

        tag:
          payload.data?.tag ||
          "islamic-life-prayer",

        renotify: false
      };

      return self.registration.showNotification(
        title,
        options
      );
    });

  } catch (error) {
    console.error(
      "Firebase Messaging Error:",
      error
    );
  }
}

/* 3. NOTIFICATION CLICK */

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url ||
      "./index.html#prayer",
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then(windowClients => {

        for (const client of windowClients) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.navigate(target);
            return client.focus();
          }
        }

        return clients.openWindow(target);
      })
  );
});

/* 4. PWA CACHE SETTINGS */

const CACHE_NAME = "islamic-life-v4";

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

/* 5. INSTALL EVENT */

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {

        const requiredFiles = APP_FILES.filter(
          file =>
            !file.includes("creator.jpg") &&
            !file.includes("icon-")
        );

        await cache.addAll(requiredFiles);

        const optionalFiles = APP_FILES.filter(
          file =>
            file.includes("creator.jpg") ||
            file.includes("icon-")
        );

        await Promise.all(
          optionalFiles.map(file =>
            cache.add(file).catch(() => null)
          )
        );

      })
      .then(() => self.skipWaiting())
  );

});

/* 6. ACTIVATE EVENT */

self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );

});

/* 7. FETCH EVENT - OFFLINE SUPPORT */

self.addEventListener("fetch", event => {

  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Do not cache external APIs or audio
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(

    caches.match(request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(response => {

            if (
              response &&
              response.ok &&
              response.type === "basic"
            ) {

              const responseCopy = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseCopy);
                });

            }

            return response;

          })
          .catch(() => {

            if (request.mode === "navigate") {
              return caches.match("./index.html");
            }

            return new Response(
              "ইন্টারনেট সংযোগ নেই।",
              {
                status: 503,
                statusText: "Offline"
              }
            );

          });

      })

  );

});
