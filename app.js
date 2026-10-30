
(() => {
"use strict";

/* =====================================
   IM MUSLIM — ISLAMIC LIFE
   Main Application JavaScript
===================================== */

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const STORE = {
  theme: "il-theme",
  language: "im-muslim-language",
  profile: "il-profile-v1",
  bookmarks: "im-muslim-bookmarks",
  tasbih: "im-muslim-tasbih",
  prayer: "il-last-prayer-times"
};

function get(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage unavailable:", e);
  }
}

function text(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function html(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function on(id, event, callback) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, callback);
  return el;
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

const screens = [
  "home", "menu", "prayer", "quran", "duas",
  "hadith", "history", "prophets", "companions",
  "calendar", "ramadan", "qibla", "tasbih",
  "amal", "zakat", "quiz", "mosques", "saved",
  "profile"
];

let language = get(STORE.language, "bn");
let currentScreen = "home";

/* =====================================
   TRANSLATIONS
===================================== */

const translations = {
  "আসসালামু আলাইকুম": "Assalamu Alaikum",
  "আপনার প্রতিদিনের": "Your Daily",
  "ইসলামিক সঙ্গী": "Islamic Companion",
  "পরবর্তী নামাজ": "Next Prayer",
  "নামাজের সময়": "Prayer Times",
  "নামাজের সময়": "Prayer Times",
  "শহর অনুযায়ী সময় দেখুন": "View prayer times by city",
  "সকল বিভাগ": "All Categories",
  "হোম": "Home",
  "মেনু": "Menu",
  "কুরআন": "Quran",
  "আল-কুরআন": "The Holy Quran",
  "নামাজ ও আজান": "Prayer & Adhan",
  "দোয়া ও জিকির": "Duas & Dhikr",
  "হাদিস": "Hadith",
  "ইসলামের ইতিহাস": "Islamic History",
  "ইতিহাস": "History",
  "নবী ও রাসুল": "Prophets & Messengers",
  "নবী-রাসুল": "Prophets",
  "সাহাবিগণ": "Companions",
  "হিজরি ক্যালেন্ডার": "Hijri Calendar",
  "রমজান": "Ramadan",
  "কিবলা": "Qibla",
  "কিবলা কম্পাস": "Qibla Compass",
  "তাসবিহ": "Tasbih",
  "দৈনিক আমল": "Daily Deeds",
  "আমল": "Daily Deeds",
  "যাকাত": "Zakat",
  "যাকাত ক্যালকুলেটর": "Zakat Calculator",
  "ইসলামিক কুইজ": "Islamic Quiz",
  "কুইজ": "Quiz",
  "মসজিদ খুঁজুন": "Find a Mosque",
  "মসজিদ": "Mosques",
  "সংরক্ষিত": "Saved",
  "প্রোফাইল": "Profile",
  "সময় দেখুন": "Show Times",
  "সময়সূচি": "Schedule",
  "শহর": "City",
  "আজানের নোটিফিকেশন": "Adhan Notifications",
  "ফজর": "Fajr",
  "সূর্যোদয়": "Sunrise",
  "যোহর": "Dhuhr",
  "আসর": "Asr",
  "মাগরিব": "Maghrib",
  "এশা": "Isha",
  "ঠিক সময়ে": "At prayer time",
  "৫ মিনিট আগে": "5 minutes before",
  "১০ মিনিট আগে": "10 minutes before",
  "পছন্দ সংরক্ষণ": "Save Preferences",
  "নোটিফিকেশন চালু করুন": "Enable Notifications",
  "সূরা নির্বাচন": "Select Surah",
  "পড়ুন": "Read",
  "সূরা খুঁজুন": "Search Surah",
  "তিলাওয়াত": "Recitation",
  "শুনুন": "Listen",
  "খুঁজুন": "Search",
  "সব": "All",
  "দৈনন্দিন": "Daily",
  "সকাল-সন্ধ্যা": "Morning & Evening",
  "আজকের হিজরি তারিখ": "Today's Hijri Date",
  "কিবলার দিক নির্ণয়": "Find Qibla Direction",
  "গণনা করুন": "Count",
  "রিসেট": "Reset",
  "পাঁচ ওয়াক্ত নামাজ": "Five Daily Prayers",
  "কুরআন তিলাওয়াত": "Quran Recitation",
  "সকাল-সন্ধ্যার জিকির": "Morning & Evening Dhikr",
  "দরুদ পাঠ": "Send Blessings",
  "সদকা / ভালো কাজ": "Charity / Good Deeds",
  "সম্পদ": "Assets",
  "ঋণ": "Debts",
  "হিসাব করুন": "Calculate",
  "শুরু করুন": "Start",
  "শুরু": "Start",
  "পরের প্রশ্ন": "Next Question",
  "Google Maps-এ খুঁজুন": "Find on Google Maps",
  "নাম": "Name",
  "সংরক্ষণ": "Save",
  "লগইন": "Log In",
  "অ্যাকাউন্ট খুলুন": "Create Account",
  "ইমেইল": "Email",
  "পাসওয়ার্ড": "Password",
  "নির্মাতা পরিচিতি": "About the Creator",
  "নির্মাতা": "Creator",
  "আরবি কপি": "Copy Arabic",
  "বাংলা": "Bangla",
  "ইংরেজি": "English",
  "সূরা": "Surah",
  "আয়াত": "Ayah",
  "এখনও কিছু সংরক্ষিত নেই": "Nothing saved yet",
  "এখনো কোনো আয়াত সংরক্ষণ করা হয়নি।": "No ayahs saved yet.",
  "এই ডিভাইসে সংরক্ষিত হয়েছে।": "Saved on this device.",
  "লোড হচ্ছে…": "Loading...",
  "সময়সূচি পাওয়া যায়নি": "Schedule unavailable",
  "তারিখ পাওয়া যায়নি": "Date unavailable",
  "সূরা লোড হয়নি": "Could not load Surah",
  "সঠিক!": "Correct!",
  "সঠিক উত্তর:": "Correct answer:",
  "অনুমতি দেওয়া হয়নি।": "Permission not granted.",
  "অনুমতি দেওয়া হয়েছে": "Permission granted",
  "আজ": "Today",
  "সম্পন্ন": "Completed",
  "Founder & Creator": "Founder & Creator",
  "জ্ঞান, ইবাদত ও উপকারী প্রযুক্তির উদ্যোগ।":
    "An initiative for knowledge, worship and useful technology."
};

const reverseTranslations = Object.fromEntries(
  Object.entries(translations).map(([bn, en]) => [en, bn])
);

const originalText = new WeakMap();
const originalPlaceholders = new WeakMap();

function translatePage() {
  const english = language === "en";
  document.documentElement.lang = language;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    if (!originalText.has(node)) {
      originalText.set(node, node.textContent);
    }

    const original = originalText.get(node);
    const trimmed = original.trim();

    if (!trimmed) return;

    const translated = english
      ? translations[trimmed]
      : reverseTranslations[trimmed];

    if (translated) {
      node.textContent = original.replace(trimmed, translated);
    } else {
      node.textContent = original;
    }
  });

  $$("input, textarea").forEach(input => {
    if (!originalPlaceholders.has(input)) {
      originalPlaceholders.set(
        input,
        input.getAttribute("placeholder") || ""
      );
    }

    const original = originalPlaceholders.get(input);
    const translated = english
      ? translations[original]
      : reverseTranslations[original];

    if (translated) input.placeholder = translated;
    else input.placeholder = original;
  });
}

function t(bn, en) {
  return language === "en" ? en : bn;
}

function setupLanguage() {
  const select = $("#languageSelect");
  if (!select) return;

  select.value = language;

  select.addEventListener("change", () => {
    language = select.value === "en" ? "en" : "bn";
    set(STORE.language, language);
    translatePage();
    renderDynamicContent();
  });

  translatePage();
}

/* =====================================
   SCREEN NAVIGATION
===================================== */

function showScreen(name) {
  if (!screens.includes(name)) name = "home";

  currentScreen = name;

  $$(".screen").forEach(screen => {
    screen.classList.toggle(
      "active",
      screen.id === "screen-" + name
    );
  });

  $$("nav [data-screen]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.screen === name
    );
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "saved") renderSaved();
  if (name === "amal") renderAmal();
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-screen]");
  if (button) showScreen(button.dataset.screen);
});

/* =====================================
   DARK MODE
===================================== */

function setupTheme() {
  if (get(STORE.theme, false)) {
    document.body.classList.add("dark");
  }

  on("darkModeBtn", "click", () => {
    document.body.classList.toggle("dark");
    set(STORE.theme, document.body.classList.contains("dark"));
  });
}

/* =====================================
   DATE
===================================== */

function showToday() {
  const locale = language === "en" ? "en-US" : "bn-BD";
  text(
    "todayDate",
    new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(new Date())
  );
}

/* =====================================
   PROFILE
===================================== */

function setupProfile() {
  const profile = get(STORE.profile, {
    name: "",
    city: "Dhaka"
  });

  if ($("#profileName")) $("#profileName").value = profile.name;
  if ($("#profileCity")) $("#profileCity").value = profile.city;

  on("saveProfileBtn", "click", () => {
    set(STORE.profile, {
      name: $("#profileName")?.value || "",
      city: $("#profileCity")?.value || "Dhaka"
    });

    text(
      "profileMessage",
      t("এই ডিভাইসে সংরক্ষিত হয়েছে।", "Saved on this device.")
    );
  });

  on("creatorBtn", "click", () => {
    $("#creatorModal")?.classList.add("open");
  });

  on("closeCreatorBtn", "click", () => {
    $("#creatorModal")?.classList.remove("open");
  });

  $("#creatorModal")?.addEventListener("click", e => {
    if (e.target.id === "creatorModal") {
      e.currentTarget.classList.remove("open");
    }
  });
}

/* =====================================
   PRAYER TIMES
===================================== */

const prayerNames = {
  Fajr: ["ফজর", "Fajr"],
  Sunrise: ["সূর্যোদয়", "Sunrise"],
  Dhuhr: ["যোহর", "Dhuhr"],
  Asr: ["আসর", "Asr"],
  Maghrib: ["মাগরিব", "Maghrib"],
  Isha: ["এশা", "Isha"]
};

let timings = {};

function prayerName(key) {
  return prayerNames[key]
    ? prayerNames[key][language === "en" ? 1 : 0]
    : key;
}

async function loadPrayerTimes() {
  const city = $("#prayerCity")?.value.trim() || "Dhaka";
  text("prayerInfo", t("লোড হচ্ছে…", "Loading..."));

  try {
    const url =
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Bangladesh&method=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 200) throw new Error("Prayer API error");

    timings = data.data.timings;

    text(
      "prayerInfo",
      `${data.data.date.readable} · ${city} · Method 1`
    );

    renderPrayerCards();

    const now = new Date();

    const next = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
      .map(key => {
        const [h, m] = timings[key].split(":");
        const date = new Date();
        date.setHours(Number(h), Number(m), 0, 0);

        let diff = (date - now) / 60000;
        if (diff < 0) diff += 1440;

        return { key, diff };
      })
      .sort((a, b) => a.diff - b.diff)[0];

    text("nextPrayerName", prayerName(next.key));

    const hours = Math.floor(next.diff / 60);
    const minutes = Math.floor(next.diff % 60);

    text(
      "nextPrayerCountdown",
      language === "en"
        ? `About ${hours} hours ${minutes} minutes remaining`
        : `প্রায় ${hours} ঘণ্টা ${minutes} মিনিট বাকি`
    );

    set(STORE.prayer, { city, timings });

  } catch (error) {
    console.error(error);
    text(
      "prayerInfo",
      t(
        "সময়সূচি পাওয়া যায়নি; শহরের নাম ও ইন্টারনেট পরীক্ষা করুন।",
        "Prayer times unavailable. Check city name and internet."
      )
    );
  }
}

function renderPrayerCards() {
  const container = $("#prayerCards");
  if (!container) return;

  container.innerHTML = Object.keys(prayerNames).map(key => `
    <div class="prayer-row">
      <b>${prayerName(key)}</b>
      <strong>${timings[key] || "—"}</strong>
    </div>
  `).join("");
}

on("prayerBtn", "click", loadPrayerTimes);

const previousPrayer = get(STORE.prayer, null);
if (previousPrayer) {
  timings = previousPrayer.timings || {};
  if ($("#prayerCity")) $("#prayerCity").value = previousPrayer.city;
  renderPrayerCards();
} else {
  loadPrayerTimes();
}

/* Adhan preferences */
on("saveAzanPrefs", "click", () => {
  const selected = $$("[data-prayer-notify]")
    .filter(el => el.checked)
    .map(el => el.dataset.prayerNotify);

  set("il-azan-preferences-v2", {
    selected,
    reminder: $("#azanReminder")?.value || "0"
  });

  text(
    "firebasePushStatus",
    t("পছন্দ সংরক্ষিত হয়েছে।", "Preferences saved.")
  );
});

on("azanNotifyBtn", "click", async () => {
  if (!("Notification" in window)) {
    alert(t("এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়।", "Notifications are not supported."));
    return;
  }

  try {
    const permission = await Notification.requestPermission();

    text(
      "firebasePushStatus",
      permission === "granted"
        ? t(
            "অনুমতি দেওয়া হয়েছে; নির্ধারিত আজান নোটিফিকেশনের জন্য backend প্রয়োজন।",
            "Permission granted; a backend is needed for scheduled Adhan notifications."
          )
        : t("অনুমতি দেওয়া হয়নি।", "Permission not granted.")
    );
  } catch {
    text("firebasePushStatus", "Notification error");
  }
});

/* =====================================
   QURAN
===================================== */

let surahs = [];

async function initQuran() {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await response.json();

    surahs = data.data || [];
    renderSurahOptions();
  } catch (error) {
    console.error("Surah list error:", error);
  }
}

function renderSurahOptions() {
  const select = $("#surahSelect");
  if (!select) return;

  const previous = select.value;

  select.innerHTML =
    `<option value="">${t("সূরা নির্বাচন", "Select Surah")}</option>` +
    surahs.map(s => `
      <option value="${s.number}">
        ${s.number}. ${s.name} — ${s.englishName}
      </option>
    `).join("");

  select.value = previous;
}

on("surahSearch", "input", event => {
  const query = event.target.value.toLowerCase();

  $$("option", $("#surahSelect")).forEach((option, index) => {
    if (!index) return;
    option.hidden = !option.textContent.toLowerCase().includes(query);
  });
});

async function loadQuran() {
  const number = $("#surahSelect")?.value;

  if (!number) {
    text("quranInfo", t("প্রথমে একটি সূরা নির্বাচন করুন।", "Please select a Surah first."));
    return;
  }

  text("quranInfo", t("লোড হচ্ছে…", "Loading..."));

  try {
    const translationEdition = language === "en"
      ? "en.sahih"
      : "bn.bengali";

    const [arabicResponse, translationResponse] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${number}/${translationEdition}`)
    ]);

    const arabicData = await arabicResponse.json();
    const translationData = await translationResponse.json();

    const arabicAyahs = arabicData.data.ayahs;
    const translatedAyahs = translationData.data.ayahs;

    const surahName = arabicData.data.name;

    html("quranInfo", arabicAyahs.map((ayah, index) => `
      <article class="content-card ayah">
        <div class="arabic-text">${ayah.text}</div>
        <p>${translatedAyahs[index]?.text || ""}</p>
        <small>${t("আয়াত", "Ayah")} ${ayah.numberInSurah}</small>
        <button
          type="button"
          data-bookmark="${number}:${ayah.numberInSurah}"
          aria-label="Save ayah"
        >♡</button>
      </article>
    `).join(""));

    const audio = $("#quranAudio");
    if (audio) {
      audio.src =
        `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${number}.mp3`;
    }

    text("audioTitle", surahName);

  } catch (error) {
    console.error(error);
    text("quranInfo", t("সূরা লোড হয়নি", "Could not load Surah."));
  }
}

on("quranBtn", "click", loadQuran);

on("playSurahBtn", "click", () => {
  $("#quranAudio")?.play().catch(() => {});
});

/* Bookmarks use the original "surah:ayah" format */
function getBookmarks() {
  return get(STORE.bookmarks, []);
}

function saveBookmark(value) {
  const bookmarks = getBookmarks();

  if (!bookmarks.includes(value)) {
    bookmarks.push(value);
    set(STORE.bookmarks, bookmarks);
  }

  renderSaved();
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-bookmark]");
  if (!button) return;

  saveBookmark(button.dataset.bookmark);
  button.textContent = "✓";
});

function renderSaved() {
  const bookmarks = getBookmarks();

  const content = bookmarks.length
    ? bookmarks.map(value => {
        const [surah, ayah] = value.split(":");

        return `
          <div class="content-card">
            <p>${t("সূরা", "Surah")} ${surah} · ${t("আয়াত", "Ayah")} ${ayah}</p>
            <button data-remove-bookmark="${value}">
              ${t("সংরক্ষণ থেকে সরান", "Remove")}
            </button>
          </div>
        `;
      }).join("")
    : `<p>${t("এখনো কোনো আয়াত সংরক্ষণ করা হয়নি।", "No ayahs saved yet.")}</p>`;

  html("savedList", content);
  html("bookmarkListSaved", content);
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-bookmark]");
  if (!button) return;

  const value = button.dataset.removeBookmark;
  const bookmarks = getBookmarks().filter(x => x !== value);

  set(STORE.bookmarks, bookmarks);
  renderSaved();
});

/* =====================================
   DUAS
===================================== */

const duas = [
  {
    title: ["খাওয়ার আগে", "Before Eating"],
    arabic: "بِسْمِ اللَّهِ",
    meaning: ["আল্লাহর নামে শুরু করছি।", "In the name of Allah."],
    source: "সুনান আবু দাউদ ৩৭৬৭"
  },
  {
    title: ["নিয়তের গুরুত্ব", "Importance of Intention"],
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    meaning: [
      "নিশ্চয়ই কাজ নিয়তের ওপর নির্ভরশীল।",
      "Actions are judged by intentions."
    ],
    source: "সহিহ বুখারি ১"
  }
];

function renderDuas() {
  const query = ($("#duaSearch")?.value || "").toLowerCase();

  const results = duas.filter(item =>
    [...item.title, item.arabic, ...item.meaning, item.source]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  html("duaList", results.length
    ? results.map(item => `
        <div class="content-card">
          <h3>${item.title[language === "en" ? 1 : 0]}</h3>
          <p class="arabic-text">${item.arabic}</p>
          <p>${item.meaning[language === "en" ? 1 : 0]}</p>
          <small>${item.source}</small>
        </div>
      `).join("")
    : `<p>${t("কোনো দোয়া পাওয়া যায়নি।", "No dua found.")}</p>`
  );
}

on("duaSearch", "input", renderDuas);

/* =====================================
   HADITH
===================================== */

const hadiths = [
  [
    "নিয়তের গুরুত্ব",
    "নিশ্চয়ই সকল কাজ নিয়তের ওপর নির্ভরশীল।",
    "সহিহ বুখারি ১; সহিহ মুসলিম ১৯০৭",
    "Importance of Intention",
    "Actions are judged by intentions."
  ],
  [
    "সহজতা",
    "দ্বীন সহজ।",
    "সহিহ বুখারি ৩৯",
    "Ease",
    "The religion is easy."
  ]
];

function renderHadith() {
  html("hadithInfo", hadiths.map(item => `
    <div class="content-card">
      <h3>${item[language === "en" ? 3 : 0]}</h3>
      <p>${item[language === "en" ? 4 : 1]}</p>
      <small>${item[2]}</small>
    </div>
  `).join(""));
}

/* =====================================
   ISLAMIC HISTORY
===================================== */

const historyItems = [
  [
    "নবুয়তের সূচনা",
    "মক্কায় প্রথম ওহি অবতরণের মাধ্যমে নবুয়তি অধ্যায়ের সূচনা।",
    "কুরআন ৯৬:১–৫",
    "Beginning of Prophethood",
    "The first revelation in Makkah marked the beginning of Prophethood."
  ],
  [
    "হিজরত",
    "মক্কা থেকে মদিনায় হিজরত মুসলিম ইতিহাসে গুরুত্বপূর্ণ মোড়।",
    "কুরআন ৯:৪০",
    "Hijrah",
    "The migration from Makkah to Madinah was a major turning point."
  ],
  [
    "খুলাফায়ে রাশেদিন",
    "প্রথম চার খলিফার যুগ প্রাথমিক মুসলিম ইতিহাসের গুরুত্বপূর্ণ অধ্যায়।",
    "প্রাথমিক ইসলামী ইতিহাসগ্রন্থ",
    "The Rightly Guided Caliphs",
    "The era of the first four caliphs is an important part of early Islamic history."
  ]
];

function renderHistory() {
  html("historyList", historyItems.map(item => `
    <div class="content-card">
      <h3>${item[language === "en" ? 3 : 0]}</h3>
      <p>${item[language === "en" ? 4 : 1]}</p>
      <small>${item[2]}</small>
    </div>
  `).join(""));
}

/* =====================================
   PROPHETS
===================================== */

const prophets = [
  "আদম", "ইদ্রিস", "নূহ", "হুদ", "সালিহ",
  "ইবরাহিম", "লূত", "ইসমাইল", "ইসহাক", "ইয়াকুব",
  "ইউসুফ", "আইয়ুব", "শুআইব", "মূসা", "হারুন",
  "যুলকিফল", "দাউদ", "সুলাইমান", "ইলিয়াস",
  "আল-ইয়াসা", "ইউনুস", "যাকারিয়া", "ইয়াহইয়া",
  "ঈসা", "মুহাম্মদ ﷺ"
];

const prophetsEnglish = [
  "Adam", "Idris", "Nuh", "Hud", "Salih",
  "Ibrahim", "Lut", "Ismail", "Ishaq", "Yaqub",
  "Yusuf", "Ayyub", "Shuayb", "Musa", "Harun",
  "Dhul-Kifl", "Dawud", "Sulayman", "Ilyas",
  "Al-Yasa", "Yunus", "Zakariya", "Yahya",
  "Isa", "Muhammad ﷺ"
];

function renderProphets() {
  html("prophetList", prophets.map((name, index) => `
    <div class="content-card">
      ${index + 1}. ${language === "en" ? prophetsEnglish[index] : name}
      <p class="muted">
        ${t(
          "বিস্তারিত জানতে সংশ্লিষ্ট কুরআনের আয়াত ও নির্ভরযোগ্য তাফসির পড়ুন।",
          "Read the relevant Quranic verses and reliable Tafsir for details."
        )}
      </p>
    </div>
  `).join(""));
}

/* =====================================
   COMPANIONS
===================================== */

const companions = [
  ["আবু বকর (রা.)", "প্রথম খলিফা; প্রাথমিক মুসলিম সমাজে গুরুত্বপূর্ণ ভূমিকা।", "Abu Bakr (RA)", "The first caliph and an important early Muslim leader."],
  ["উমর (রা.)", "দ্বিতীয় খলিফা; প্রশাসনিক ইতিহাসে গুরুত্বপূর্ণ।", "Umar (RA)", "The second caliph, known for his leadership."],
  ["উসমান (রা.)", "তৃতীয় খলিফা; মুসহাফ সংরক্ষণের প্রচেষ্টার সঙ্গে যুক্ত।", "Uthman (RA)", "The third caliph, associated with the standardization of the Mushaf."],
  ["আলী (রা.)", "চতুর্থ খলিফা; প্রাথমিক ইসলামের গুরুত্বপূর্ণ ব্যক্তিত্ব।", "Ali (RA)", "The fourth caliph and an important early Muslim figure."],
  ["খাদিজা (রা.)", "প্রথম ঈমান গ্রহণকারীদের একজন।", "Khadijah (RA)", "One of the earliest believers."],
  ["আয়িশা (রা.)", "হাদিস ও জ্ঞানচর্চায় বিশিষ্ট বর্ণনাকারী।", "Aishah (RA)", "A distinguished narrator of Hadith and Islamic knowledge."]
];

function renderCompanions() {
  html("companionList", companions.map(item => `
    <div class="content-card">
      <h3>${item[language === "en" ? 2 : 0]}</h3>
      <p>${item[language === "en" ? 3 : 1]}</p>
    </div>
  `).join(""));
}

/* =====================================
   HIJRI DATE
===================================== */

async function loadHijri() {
  try {
    const date = new Date();
    const dateString =
      `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    const response = await fetch(
      `https://api.aladhan.com/v1/gToH?date=${dateString}`
    );

    const data = await response.json();
    const hijri = data.data.hijri;

    const value = language === "en"
      ? `${hijri.day} ${hijri.month.en} ${hijri.year} AH`
      : `${hijri.day} ${hijri.month.ar} ${hijri.year} হিজরি`;

    text("hijriInfo", value);
    text("hijriQuick", value);

  } catch {
    text("hijriInfo", t("তারিখ পাওয়া যায়নি", "Date unavailable"));
  }
}

on("hijriBtnFull", "click", loadHijri);

/* =====================================
   RAMADAN CALENDAR
===================================== */

async function loadRamadan() {
  const city = $("#ramadanCity")?.value || "Dhaka";
  const date = new Date();

  text("ramadanInfo", t("লোড হচ্ছে…", "Loading..."));

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/calendarByCity/${date.getFullYear()}/${date.getMonth() + 1}?city=${encodeURIComponent(city)}&country=Bangladesh&method=1`
    );

    const data = await response.json();

    html("ramadanInfo", data.data.slice(0, 10).map(item => `
      <div class="content-card">
        ${item.date.readable}
        <p>
          ${t("সেহরি শেষ", "Suhoor ends")} ${item.timings.Fajr}
          ·
          ${t("ইফতার", "Iftar")} ${item.timings.Maghrib}
        </p>
      </div>
    `).join(""));

  } catch {
    text("ramadanInfo", t("সময়সূচি পাওয়া যায়নি", "Schedule unavailable"));
  }
}

on("ramadanBtn", "click", loadRamadan);

/* =====================================
   QIBLA
===================================== */

function calculateQibla(latitude, longitude) {
  const lat = latitude * Math.PI / 180;
  const kaabaLat = 21.4225 * Math.PI / 180;
  const longitudeDifference = (39.8262 - longitude) * Math.PI / 180;

  const angle = Math.atan2(
    Math.sin(longitudeDifference),
    Math.cos(lat) * Math.tan(kaabaLat) -
    Math.sin(lat) * Math.cos(longitudeDifference)
  );

  return (angle * 180 / Math.PI + 360) % 360;
}

on("qiblaBtn", "click", () => {
  if (!navigator.geolocation) {
    text("qiblaDegree", t("লোকেশন সমর্থিত নয়", "Location not supported"));
    return;
  }

  text("qiblaDegree", t("অবস্থান খোঁজা হচ্ছে…", "Getting location..."));

  navigator.geolocation.getCurrentPosition(
    position => {
      const degree = calculateQibla(
        position.coords.latitude,
        position.coords.longitude
      );

      text("qiblaDegree", Math.round(degree) + "°");

      const needle = $("#compassNeedle");
      if (needle) {
        needle.style.transform =
          `translateX(-50%) rotate(${degree}deg)`;
      }
    },
    () => {
      text("qiblaDegree", t("লোকেশন অনুমতি দিন", "Allow location access"));
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
});

/* =====================================
   TASBIH
===================================== */

let tasbihCount = get(STORE.tasbih, 0);

function renderTasbih() {
  text("tasbihCount", tasbihCount.toLocaleString(
    language === "en" ? "en-US" : "bn-BD"
  ));
}

on("tasbihBtn", "click", () => {
  tasbihCount++;
  set(STORE.tasbih, tasbihCount);
  renderTasbih();
});

on("resetBtn", "click", () => {
  tasbihCount = 0;
  set(STORE.tasbih, 0);
  renderTasbih();
});

/* =====================================
   DAILY AMAL
===================================== */

const amalKey =
  "il-amal-" + new Date().toISOString().slice(0, 10);

let amal = get(amalKey, []);

function renderAmal() {
  const checks = $$(".amal-check");

  checks.forEach((checkbox, index) => {
    checkbox.checked = !!amal[index];
  });

  const completed = amal.filter(Boolean).length;
  const total = checks.length || 5;

  text(
    "amalProgress",
    `${completed}/${total} ${t("সম্পন্ন", "completed")}`
  );

  const bar = $("#amalProgressBar");
  if (bar) {
    bar.style.width = (completed / total * 100) + "%";
  }

  text(
    "dailySummary",
    language === "en"
      ? `${completed} daily deeds completed today.`
      : `আজ ${completed}টি আমল সম্পন্ন।`
  );
}

$$(".amal-check").forEach((checkbox, index) => {
  checkbox.addEventListener("change", () => {
    amal[index] = checkbox.checked;
    set(amalKey, amal);
    renderAmal();
  });
});

/* =====================================
   ZAKAT CALCULATOR
===================================== */

on("zakatBtn", "click", () => {
  const assets = safeNumber($("#zakatAssets")?.value);
  const debts = safeNumber($("#zakatDebts")?.value);
  const net = Math.max(0, assets - debts);
  const zakat = net * 0.025;

  const formatter = new Intl.NumberFormat(
    language === "en" ? "en-BD" : "bn-BD"
  );

  text(
    "zakatInfo",
    language === "en"
      ? `Net assets: ৳${formatter.format(net)} · Estimated Zakat (2.5%): ৳${formatter.format(zakat)}. Check Nisab, Hawl and eligible assets.`
      : `নিট সম্পদ ৳${formatter.format(net)} · আনুমানিক যাকাত ২.৫% = ৳${formatter.format(zakat)}। নিসাব, হাওল ও সম্পদের ধরন যাচাই করুন।`
  );
});

/* =====================================
   ISLAMIC QUIZ
===================================== */

const quiz = [
  {
    question: [
      "কুরআনের প্রথম অবতীর্ণ আয়াত কোন সূরায়?",
      "Which Surah contains the first revealed verses?"
    ],
    options: [
      ["ফাতিহা", "আল-আলাক", "ইখলাস"],
      ["Al-Fatihah", "Al-Alaq", "Al-Ikhlas"]
    ],
    answer: 1,
    source: "সূরা আল-আলাক ৯৬:১–৫"
  },
  {
    question: ["কিবলা কোনটি?", "What is the Qibla?"],
    options: [
      ["কাবা", "মসজিদে নববি", "মসজিদুল আকসা"],
      ["The Kaaba", "Prophet's Mosque", "Al-Aqsa Mosque"]
    ],
    answer: 0,
    source: "কাবা শরিফ"
  }
];

let quizIndex = 0;

function renderQuiz() {
  const item = quiz[quizIndex];

  text(
    "quizQuestion",
    item.question[language === "en" ? 1 : 0]
  );

  html(
    "quizOptions",
    item.options[language === "en" ? 1 : 0]
      .map((option, index) => `
        <button type="button" data-answer="${index}">
          ${option}
        </button>
      `).join("")
  );

  text("quizFeedback", "");
}

on("quizStartBtn", "click", () => {
  quizIndex = 0;
  renderQuiz();
});

on("quizNextBtn", "click", () => {
  quizIndex = (quizIndex + 1) % quiz.length;
  renderQuiz();
});

on("quizOptions", "click", event => {
  const button = event.target.closest("[data-answer]");
  if (!button) return;

  const answer = Number(button.dataset.answer);
  const item = quiz[quizIndex];

  const correct = answer === item.answer;

  text(
    "quizFeedback",
    correct
      ? `${t("সঠিক!", "Correct!")} ${item.source}`
      : `${t("সঠিক উত্তর:", "Correct answer:")} ${item.options[language === "en" ? 1 : 0][item.answer]}`
  );

  $$("[data-answer]").forEach(option => {
    option.disabled = true;
  });
});

/* =====================================
   MOSQUE FINDER
===================================== */

on("mosqueBtn", "click", () => {
  window.open(
    "https://www.google.com/maps/search/mosque+near+me/",
    "_blank",
    "noopener"
  );
});

/* =====================================
   DYNAMIC CONTENT REFRESH
===================================== */

function renderDynamicContent() {
  showToday();
  renderSurahOptions();
  renderPrayerCards();
  renderDuas();
  renderHadith();
  renderHistory();
  renderProphets();
  renderCompanions();
  renderSaved();
  renderTasbih();
  renderAmal();
  loadHijri();

  if ($("#quizQuestion")?.textContent) {
    renderQuiz();
  }
}

/* =====================================
   SERVICE WORKER
===================================== */

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch(error => console.warn("Service worker:", error));
  });
}

/* =====================================
   APP START
===================================== */

function startApp() {
  setupTheme();
  setupProfile();
  setupLanguage();

  showToday();
  renderDuas();
  renderHadith();
  renderHistory();
  renderProphets();
  renderCompanions();
  renderSaved();
  renderTasbih();
  renderAmal();
  renderSurahOptions();
  renderPrayerCards();
  loadHijri();

  showScreen("home");
  initQuran();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}

})();
