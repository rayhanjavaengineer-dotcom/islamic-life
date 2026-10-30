
"use strict";

const CACHE_NAME = "islamic-life-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./creator.jpg"
];

// অ্যাপ ইনস্টল করার সময় প্রয়োজনীয় ফাইল ক্যাশ করা
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
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
