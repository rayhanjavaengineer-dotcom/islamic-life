// @ts-nocheck
"use strict";

/* ==========================================
   আমি মুসলিম | Islamic Life
   সম্পূর্ণ সংশোধিত app.js
   ========================================== */

const $ = (id) => document.getElementById(id);

const STORE = {
  theme: "im-muslim-theme",
  tasbih: "im-muslim-tasbih",
  bookmarks: "im-muslim-bookmarks",
  amal: "im-muslim-amal"
};

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // স্টোরেজ কাজ না করলেও অ্যাপ চালু থাকবে।
  }
}

function bnNumber(value) {
  return String(value).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[Number(d)]);
}

function makeNode(tag, text, className) {
  const node = document.createElement(tag);

  if (text !== undefined && text !== null) {
    node.textContent = text;
  }

  if (className) node.className = className;

  return node;
}

function setMessage(id, message) {
  const el = $(id);
  if (el) el.textContent = message;
}

async function getJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("সার্ভার থেকে তথ্য পাওয়া যায়নি।");
  }

  return response.json();
}

function addButton(
  parent,
  label,
  callback,
  className = "secondary-btn"
) {
  const button = makeNode("button", label, className);

  button.type = "button";
  button.addEventListener("click", callback);
  parent.appendChild(button);

  return button;
}

function formatTime(time) {
  if (!time) return "—";

  return String(time)
    .replace(/\s*\([^)]*\)/g, "")
    .trim();
}

/* তারিখ ও ফুটার */
function showToday() {
  const now = new Date();

  setMessage(
    "todayDate",
    new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(now)
  );

  setMessage("footerYear", now.getFullYear());
}

/* ডার্ক মোড */
function setupTheme() {
  const button = $("darkModeBtn");
  const theme = readStore(STORE.theme, "light");

  if (theme === "dark") {
    document.body.classList.add("dark");
  }

  if (!button) return;

  function updateButton() {
    button.textContent =
      document.body.classList.contains("dark") ? "☀" : "◐";
  }

  updateButton();

  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    writeStore(
      STORE.theme,
      document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );

    updateButton();
  });
}

/* অ্যাপ নির্মাতার পপআপ */
function setupCreatorModal() {
  const openButton = $("creatorBtn");
  const closeButton = $("closeCreatorBtn");
  const modal = $("creatorModal");

  if (!openButton || !closeButton || !modal) return;

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openButton.focus();
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.querySelectorAll("[data-close-creator]").forEach(element => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

/* ==========================================
   নামাজের নিয়ত
   ========================================== */

/*
  নিয়ত অন্তরের ইচ্ছা।
  নিচের বাংলা উচ্চারণগুলো প্রচলিত সহায়ক উদাহরণ।
  নির্দিষ্ট বাক্য মুখে বলা সর্বজনীন বাধ্যবাধকতা নয়।
  স্থানীয় নির্ভরযোগ্য আলেমের কাছ থেকে উচ্চারণ যাচাই করুন।
*/

const niyatData = {
  fajr: {
    title: "ফজরের নামাজ",
    rakats: "২ রাকাত সুন্নত, এরপর ২ রাকাত ফরজ",
    items: [
      {
        title: "২ রাকাত সুন্নত",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা রাকআতাই সালাতিল ফাজরি সুন্নাতা রাসূলিল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহ তাআলার সন্তুষ্টির জন্য ফজরের দুই রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "২ রাকাত ফরজ",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা রাকআতাই সালাতিল ফাজরি ফারদাল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহ তাআলার সন্তুষ্টির জন্য ফজরের দুই রাকাত ফরজ নামাজ আদায়ের ইচ্ছা করছি।"
      }
    ]
  },

  zuhr: {
    title: "জোহরের নামাজ",
    rakats:
      "৪ রাকাত সুন্নত, ৪ রাকাত ফরজ, ২ রাকাত সুন্নত; এরপর নফল পড়া যায়",
    items: [
      {
        title: "৪ রাকাত সুন্নত",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা আরবা রাকআতি সালাতিজ জুহরি সুন্নাতা রাসূলিল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য জোহরের চার রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "৪ রাকাত ফরজ",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা আরবা রাকআতি সালাতিজ জুহরি ফারদাল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য জোহরের চার রাকাত ফরজ নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "২ রাকাত সুন্নত",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা রাকআতাই সালাতিজ জুহরি সুন্নাতা রাসূলিল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য জোহরের দুই রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "নফল নামাজ",
        pronunciation:
          "নফল নামাজের জন্য অন্তরে আল্লাহর সন্তুষ্টির উদ্দেশ্য স্থির করুন।",
        meaning:
          "নফল নামাজ ঐচ্ছিক ইবাদত; রাকাত ও পদ্ধতি সম্পর্কে নির্ভরযোগ্য আলেমের পরামর্শ নিন।"
      }
    ]
  },

  asr: {
    title: "আসরের নামাজ",
    rakats:
      "৪ রাকাত ফরজ; আগে ৪ রাকাত সুন্নতে গায়রে মুয়াক্কাদা পড়া যায়",
    items: [
      {
        title: "৪ রাকাত সুন্নতে গায়রে মুয়াক্কাদা",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা আরবা রাকআতি সালাতিল আসরি সুন্নাতান মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য আসরের আগে চার রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "৪ রাকাত ফরজ",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা আরবা রাকআতি সালাতিল আসরি ফারদাল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য আসরের চার রাকাত ফরজ নামাজ আদায়ের ইচ্ছা করছি।"
      }
    ]
  },

  maghrib: {
    title: "মাগরিবের নামাজ",
    rakats:
      "৩ রাকাত ফরজ, এরপর ২ রাকাত সুন্নত; নফলও পড়া যায়",
    items: [
      {
        title: "৩ রাকাত ফরজ",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা সালাসা রাকআতি সালাতিল মাগরিবি ফারদাল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য মাগরিবের তিন রাকাত ফরজ নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "২ রাকাত সুন্নত",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা রাকআতাই সালাতিল মাগরিবি সুন্নাতা রাসূলিল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য মাগরিবের দুই রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "নফল নামাজ",
        pronunciation:
          "নফল নামাজের জন্য অন্তরে আল্লাহর সন্তুষ্টির উদ্দেশ্য স্থির করুন।",
        meaning:
          "ইচ্ছা করলে নফল নামাজ পড়া যায়।"
      }
    ]
  },

  isha: {
    title: "এশার নামাজ",
    rakats:
      "৪ রাকাত ফরজ, ২ রাকাত সুন্নত এবং বিতরসহ অন্যান্য নামাজ",
    items: [
      {
        title: "৪ রাকাত সুন্নত",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা আরবা রাকআতি সালাতিল ইশাই সুন্নাতান মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "এশার ফরজের আগে চার রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "৪ রাকাত ফরজ",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা আরবা রাকআতি সালাতিল ইশাই ফারদাল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য এশার চার রাকাত ফরজ নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "২ রাকাত সুন্নত",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা রাকআতাই সালাতিল ইশাই সুন্নাতা রাসূলিল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "আল্লাহর সন্তুষ্টির জন্য এশার দুই রাকাত সুন্নত নামাজ আদায়ের ইচ্ছা করছি।"
      },
      {
        title: "৩ রাকাত বিতর",
        pronunciation:
          "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তাআলা সালাসা রাকআতি সালাতিল বিতরি ওয়াজিবাল্লাহি তাআলা মুতাওয়াজ্জিহান ইলা জিহাতিল কাবাতিশ শারীফাহ। আল্লাহু আকবার।",
        meaning:
          "হানাফি মাজহাব অনুসারে আল্লাহর সন্তুষ্টির জন্য তিন রাকাত বিতর নামাজ আদায়ের ইচ্ছা করছি। অন্য মাজহাবে বিতরের বিধান ভিন্ন হতে পারে।"
      }
    ]
  }
};

function renderNiyat(key = "fajr") {
  const box = $("niyatInfo");
  if (!box) return;

  const data = niyatData[key] || niyatData.fajr;
  box.replaceChildren();

  box.appendChild(makeNode("h3", data.title));
  box.appendChild(makeNode("p", data.rakats, "muted"));
  box.appendChild(makeNode(
    "p",
    "মনে রাখুন: নিয়ত মূলত অন্তরের ইচ্ছা। বাংলা উচ্চারণ শেখার সহায়ক মাত্র।",
    "translation"
  ));

  data.items.forEach(item => {
    const card = makeNode("article", undefined, "content-card");
    card.appendChild(makeNode("h4", item.title));
    card.appendChild(makeNode("h4", "প্রচলিত বাংলা উচ্চারণ"));
    card.appendChild(makeNode("p", item.pronunciation));
    card.appendChild(makeNode("h4", "সহজ অর্থ"));
    card.appendChild(makeNode("p", item.meaning));
    box.appendChild(card);
  });
}

function setupNiyat() {
  document.querySelectorAll("[data-prayer-tab]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-prayer-tab]").forEach(tab => {
        tab.classList.toggle("active", tab === button);
      });

      renderNiyat(button.dataset.prayerTab);
    });
  });

  renderNiyat();
}

/* ==========================================
   নামাজের সময়
   ========================================== */

async function loadPrayerTimes() {
  const city = $("prayerCity")?.value.trim() || "Dhaka";
  const box = $("prayerInfo");
  if (!box) return;

  box.textContent = "নামাজের সময় লোড হচ্ছে…";

  try {
    const url =
      "https://api.aladhan.com/v1/timingsByCity?city=" +
      encodeURIComponent(city) +
      "&country=Bangladesh&method=1";

    const data = await getJSON(url);

    if (data.code !== 200 || !data.data?.timings) {
      throw new Error("সময় পাওয়া যায়নি।");
    }

    const timings = data.data.timings;
    const labels = [
      ["Fajr", "ফজর"],
      ["Sunrise", "সূর্যোদয়"],
      ["Dhuhr", "জোহর"],
      ["Asr", "আসর"],
      ["Maghrib", "মাগরিব"],
      ["Isha", "এশা"]
    ];

    box.replaceChildren();
    box.appendChild(makeNode("h3", city + " — নামাজের সময়"));
    box.appendChild(makeNode(
      "p",
      "তারিখ: " + (data.data.date?.readable || ""),
      "muted"
    ));

    labels.forEach(([key, label]) => {
      const row = makeNode("div", undefined, "prayer-row");
      row.appendChild(makeNode("span", label));
      row.appendChild(makeNode("strong", formatTime(timings[key])));
      box.appendChild(row);
    });

    const quickGrid = $("prayerQuickTimes");
    if (quickGrid) {
      const quickItems = [
        ["Fajr", "ফজর", "🌅"],
        ["Dhuhr", "জোহর", "☀️"],
        ["Asr", "আসর", "🌤️"],
        ["Maghrib", "মাগরিব", "🌙"],
        ["Isha", "এশা", "🌌"]
      ];
      quickGrid.replaceChildren();
      quickItems.forEach(([key, label, symbol]) => {
        const item = makeNode("div", undefined, "prayer-quick-item");
        item.appendChild(makeNode("span", symbol, "prayer-symbol"));
        item.appendChild(makeNode("b", label));
        item.appendChild(makeNode("strong", bnNumber(formatTime(timings[key]))));
        quickGrid.appendChild(item);
      });
    }
    setMessage("prayerQuickCity", city + " এলাকার সময়সূচি");
    const quickButton = $("prayerQuickBtn");
    if (quickButton) quickButton.textContent = "সময়সূচি হালনাগাদ হয়েছে ✓";

    box.appendChild(makeNode(
      "p",
      "সময়সূচি স্থানীয় মসজিদ বা ইসলামিক কর্তৃপক্ষের সঙ্গে মিলিয়ে নিন।",
      "translation"
    ));
  } catch {
    box.textContent =
      "নামাজের সময় আনা যায়নি। ইন্টারনেট এবং শহরের ইংরেজি বানান পরীক্ষা করুন।";
  }
}

/* ==========================================
   কুরআন: সূরা, অনুবাদ ও অডিও
   ========================================== */

let surahs = [];
let currentSurah = 1;
let surahLoadToken = 0;
let audioLoadToken = 0;

const bookmarkData = readStore(STORE.bookmarks, []);

async function loadSurahList() {
  const select = $("surahSelect");
  const search = $("surahSearch");
  if (!select) return;

  try {
    const result = await getJSON("https://api.alquran.cloud/v1/surah");

    if (result.code !== 200 || !Array.isArray(result.data)) {
      throw new Error("সূরা তালিকা পাওয়া যায়নি।");
    }

    surahs = result.data;
    renderSurahOptions();

    if (search && !search.dataset.listenerAdded) {
      search.dataset.listenerAdded = "true";
      search.addEventListener("input", renderSurahOptions);
    }
  } catch {
    setMessage(
      "quranInfo",
      "সূরা তালিকা লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।"
    );
  }
}

function renderSurahOptions() {
  const select = $("surahSelect");
  const query = ($("surahSearch")?.value || "").trim().toLowerCase();
  if (!select) return;

  const previousValue = select.value;
  select.replaceChildren();

  const filtered = surahs.filter(surah =>
    String(surah.number).includes(query) ||
    (surah.name || "").toLowerCase().includes(query) ||
    (surah.englishName || "").toLowerCase().includes(query) ||
    (surah.englishNameTranslation || "").toLowerCase().includes(query)
  );

  filtered.forEach(surah => {
    const option = document.createElement("option");
    option.value = String(surah.number);
    option.textContent =
      bnNumber(surah.number) + ". " +
      surah.name + " — " + surah.englishName;
    select.appendChild(option);
  });

  if (!filtered.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "কোনো সূরা পাওয়া যায়নি";
    select.appendChild(option);
  } else if (filtered.some(item => String(item.number) === previousValue)) {
    select.value = previousValue;
  }
}

async function loadSurah() {
  const number = Number($("surahSelect")?.value);
  const box = $("quranInfo");

  if (!box || !number || number < 1 || number > 114) {
    setMessage("quranInfo", "প্রথমে একটি সূরা নির্বাচন করুন।");
    return;
  }

  const token = ++surahLoadToken;
  currentSurah = number;
  box.textContent = "সূরা ও অনুবাদ লোড হচ্ছে…";

  try {
    const result = await getJSON(
      `https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,bn.bengali,en.sahih`
    );

    if (token !== surahLoadToken) return;

    const editions = result.data;

    if (!Array.isArray(editions) || editions.length < 2) {
      throw new Error("সূরা বা অনুবাদ পাওয়া যায়নি।");
    }

    const arabic = editions[0].ayahs || [];
    const bangla = editions[1].ayahs || [];
    const english = editions[2]?.ayahs || [];

    box.replaceChildren();
    box.appendChild(makeNode(
      "h3",
      (editions[0].name || "সূরা") +
      " — " + (editions[0].englishName || "")
    ));

    box.appendChild(makeNode(
      "p",
      "মোট আয়াত: " + bnNumber(arabic.length),
      "muted"
    ));

    arabic.forEach((ayah, index) => {
      const card = makeNode("article", undefined, "content-card");

      card.appendChild(makeNode(
        "h4",
        "আয়াত " + bnNumber(ayah.numberInSurah || index + 1)
      ));
      card.appendChild(makeNode("p", ayah.text, "arabic-text"));

      if (bangla[index]?.text) {
        card.appendChild(makeNode("p", bangla[index].text));
      }

      if (english[index]?.text) {
        card.appendChild(makeNode("p", english[index].text, "translation"));
      }

      const actions = makeNode("div", undefined, "card-actions");

      addButton(actions, "আয়াত সংরক্ষণ", () => {
        const bookmark = {
          surah: number,
          surahName: editions[0].name || "সূরা",
          ayah: ayah.numberInSurah || index + 1,
          arabic: ayah.text,
          bangla: bangla[index]?.text || ""
        };

        const exists = bookmarkData.some(item =>
          item.surah === bookmark.surah &&
          item.ayah === bookmark.ayah
        );

        if (exists) {
          setMessage("audioTitle", "এই আয়াত আগে থেকেই সংরক্ষিত আছে।");
          return;
        }

        bookmarkData.push(bookmark);
        writeStore(STORE.bookmarks, bookmarkData);
        renderBookmarks();
        setMessage("audioTitle", "আয়াতটি সংরক্ষণ করা হয়েছে।");
      });

      addButton(actions, "আরবি কপি", () => copyText(ayah.text));
      card.appendChild(actions);
      box.appendChild(card);
    });
  } catch {
    if (token !== surahLoadToken) return;
    box.textContent =
      "সূরা লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
  }
}

function playSurah() {
  const audio = $("quranAudio");
  const title = $("audioTitle");
  const number = Number($("surahSelect")?.value) || currentSurah;

  if (!audio) {
    setMessage(
      "audioTitle",
      'HTML-এ id="quranAudio"-সহ audio element পাওয়া যায়নি।'
    );
    return;
  }

  if (!number || number < 1 || number > 114) {
    if (title) title.textContent = "আগে একটি সূরা নির্বাচন করুন।";
    return;
  }

  const token = ++audioLoadToken;
  const surahName = surahs[number - 1]?.englishName || `সূরা ${number}`;

  audio.pause();
  audio.removeAttribute("src");
  audio.load();

  audio.onerror = () => {
    if (token !== audioLoadToken) return;
    if (title) {
      title.textContent =
        "অডিও চালানো যায়নি। ইন্টারনেট, CDN এবং audio element পরীক্ষা করুন।";
    }
  };

  audio.oncanplay = () => {
    if (token !== audioLoadToken) return;
    if (title) title.textContent = surahName + " — অডিও প্রস্তুত।";
  };

  audio.onended = () => {
    if (token === audioLoadToken && title) {
      title.textContent = surahName + " — অডিও শেষ হয়েছে।";
    }
  };

  if (title) title.textContent = surahName + " — অডিও লোড হচ্ছে…";

  audio.src =
    `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${number}.mp3`;

  audio.load();

  const playPromise = audio.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.then(() => {
      if (token === audioLoadToken && title) {
        title.textContent = surahName + " — অডিও চলছে।";
      }
    }).catch(() => {
      if (token !== audioLoadToken) return;
      if (title) {
        title.textContent =
          "অডিও প্রস্তুত করার চেষ্টা হয়েছে। নিচের Play বোতামে চাপ দিন।";
      }
    });
  }
}

function renderBookmarks() {
  const list = $("bookmarkList");
  if (!list) return;

  list.replaceChildren();

  if (!bookmarkData.length) {
    list.appendChild(makeNode(
      "p",
      "এখনো কোনো আয়াত সংরক্ষণ করা হয়নি।",
      "muted"
    ));
    return;
  }

  bookmarkData.forEach((item, index) => {
    const card = makeNode("article", undefined, "content-card");

    card.appendChild(makeNode(
      "h4",
      `${item.surahName || "সূরা"} — আয়াত ${bnNumber(item.ayah)}`
    ));
    card.appendChild(makeNode("p", item.arabic || "", "arabic-text"));

    if (item.bangla) card.appendChild(makeNode("p", item.bangla));

    addButton(card, "সংরক্ষণ থেকে সরান", () => {
      bookmarkData.splice(index, 1);
      writeStore(STORE.bookmarks, bookmarkData);
      renderBookmarks();
    });

    list.appendChild(card);
  });
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      textarea.remove();

      if (!success) throw new Error("Copy failed");
    }

    setMessage("audioTitle", "কপি করা হয়েছে।");
  } catch {
    setMessage("audioTitle", "কপি করা যায়নি। লেখাটি নির্বাচন করে কপি করুন।");
  }
}

/* ==========================================
   দোয়া
   ========================================== */

const duaData = [
  {
    title: "ঘুম থেকে ওঠার দোয়া",
    category: "daily",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    pronunciation: "আলহামদু লিল্লাহিল্লাযী আহইয়ানা বা‘দা মা আমাতানা ওয়া ইলাইহিন নুশূর।",
    meaning: "সমস্ত প্রশংসা আল্লাহর, যিনি ঘুমের পর আমাদের জীবিত করেছেন; আর তাঁর কাছেই পুনরুত্থান।",
    source: "সহিহ আল-বুখারি",
    categoryName: "দৈনন্দিন"
  },
  {
    title: "খাবার শুরুর দোয়া",
    category: "daily",
    arabic: "بِسْمِ اللَّهِ",
    pronunciation: "বিসমিল্লাহ।",
    meaning: "আল্লাহর নামে শুরু করছি।",
    source: "খাবার শুরুতে আল্লাহর নাম নেওয়ার শিক্ষা",
    categoryName: "দৈনন্দিন"
  },
  {
    title: "জ্ঞান বৃদ্ধির দোয়া",
    category: "daily",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    pronunciation: "রব্বি যিদনী ইলমা।",
    meaning: "হে আমার রব, আমার জ্ঞান বৃদ্ধি করুন।",
    source: "কুরআন, সূরা ত্ব-হা ২০:১১৪",
    categoryName: "দৈনন্দিন"
  },
  {
    title: "দুনিয়া ও আখিরাতের কল্যাণের দোয়া",
    category: "prayer",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    pronunciation: "রব্বানা আতিনা ফিদ্দুনইয়া হাসানাতাওঁ ওয়া ফিল আখিরাতি হাসানাতাওঁ ওয়া কিনা আযাবান্নার।",
    meaning: "হে আমাদের রব, দুনিয়া ও আখিরাতে কল্যাণ দিন এবং আগুনের শাস্তি থেকে রক্ষা করুন।",
    source: "কুরআন, সূরা আল-বাকারা ২:২০১",
    categoryName: "নামাজ ও সাধারণ দোয়া"
  },
  {
    title: "সকাল-সন্ধ্যার সুরক্ষার দোয়া",
    category: "morning",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    pronunciation: "বিসমিল্লাহিল্লাযী লা ইয়াদুররু মা‘আসমিহী শাইউন ফিল আরদি ওয়ালা ফিস সামা-ই, ওয়া হুয়াস সামীউল আলীম।",
    meaning: "আল্লাহর নামে, যাঁর নামের সঙ্গে আসমান ও জমিনের কোনো কিছু ক্ষতি করতে পারে না। তিনি সর্বশ্রোতা, সর্বজ্ঞ।",
    source: "সুনান আবু দাউদ ও জামে আত-তিরমিজিতে বর্ণিত",
    categoryName: "সকাল-সন্ধ্যা"
  },
  {
    title: "ক্ষমা প্রার্থনা",
    category: "daily",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    pronunciation: "আস্তাগফিরুল্লাহ।",
    meaning: "আমি আল্লাহর কাছে ক্ষমা প্রার্থনা করছি।",
    source: "ইস্তিগফারের সংক্ষিপ্ত বাক্য",
    categoryName: "দৈনন্দিন"
  }
];

function renderDuas() {
  const list = $("duaList");
  if (!list) return;

  const query = ($("duaSearch")?.value || "").trim().toLowerCase();
  const category = $("duaCategory")?.value || "all";

  list.replaceChildren();

  const filtered = duaData.filter(dua => {
    const matchesCategory =
      category === "all" || dua.category === category;

    const searchable = [
      dua.title,
      dua.arabic,
      dua.pronunciation,
      dua.meaning,
      dua.source
    ].join(" ").toLowerCase();

    return matchesCategory && searchable.includes(query);
  });

  if (!filtered.length) {
    list.appendChild(makeNode("p", "কোনো দোয়া পাওয়া যায়নি।", "muted"));
    return;
  }

  filtered.forEach(dua => {
    const card = makeNode("article", undefined, "content-card");

    card.appendChild(makeNode("h3", dua.title));
    card.appendChild(makeNode("p", dua.arabic, "arabic-text"));
    card.appendChild(makeNode("h4", "বাংলা উচ্চারণ"));
    card.appendChild(makeNode("p", dua.pronunciation));
    card.appendChild(makeNode("h4", "অর্থ"));
    card.appendChild(makeNode("p", dua.meaning));
    card.appendChild(makeNode("p", "উৎস: " + dua.source, "translation"));

    const actions = makeNode("div", undefined, "card-actions");

    addButton(actions, "দোয়া কপি", () => {
      copyText(
        dua.arabic + "\n" +
        dua.pronunciation + "\n" +
        dua.meaning
      );
    });

    card.appendChild(actions);
    list.appendChild(card);
  });
}

/* ==========================================
   হাদিস
   ========================================== */

const hadithData = [
  {
    text: "কাজের প্রতিদান নিয়তের ওপর নির্ভরশীল।",
    source: "সহিহ আল-বুখারি, হাদিস ১; সহিহ মুসলিমেও বর্ণিত",
    lesson: "ইবাদত ও কাজের ক্ষেত্রে আন্তরিক নিয়ত গুরুত্বপূর্ণ।"
  },
  {
    text: "যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা নীরব থাকে।",
    source: "সহিহ আল-বুখারি ও সহিহ মুসলিম",
    lesson: "কথা বলার আগে তার উপকারিতা ও ক্ষতির কথা ভাবা উচিত।"
  },
  {
    text: "তোমাদের মধ্যে উত্তম সে, যে কুরআন শেখে এবং শেখায়।",
    source: "সহিহ আল-বুখারি, হাদিস ৫০২৭",
    lesson: "কুরআন শেখা ও অন্যকে শেখানো মর্যাদাপূর্ণ কাজ।"
  }
];

let hadithIndex = 0;

function showHadith() {
  const box = $("hadithInfo");
  if (!box) return;

  const hadith = hadithData[hadithIndex % hadithData.length];
  hadithIndex++;

  box.replaceChildren();
  box.appendChild(makeNode("p", "“" + hadith.text + "”"));
  box.appendChild(makeNode("p", "শিক্ষা: " + hadith.lesson));
  box.appendChild(makeNode("p", "উৎস: " + hadith.source, "translation"));
}

/* ==========================================
   হিজরি তারিখ
   ========================================== */

async function loadHijri() {
  const box = $("hijriInfo");
  const quick = $("hijriQuick");

  if (box) box.textContent = "হিজরি তারিখ লোড হচ্ছে…";

  try {
    const now = new Date();

    const date = [
      String(now.getDate()).padStart(2, "0"),
      String(now.getMonth() + 1).padStart(2, "0"),
      now.getFullYear()
    ].join("-");

    const data = await getJSON(
      "https://api.aladhan.com/v1/gToH/" + date
    );

    const hijri = data.data?.hijri;
    if (!hijri) throw new Error("হিজরি তারিখ পাওয়া যায়নি।");

    const text =
      `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

    if (quick) {
      quick.textContent =
        `${hijri.day} ${hijri.month.ar || hijri.month.en} ${hijri.year}`;
    }

    if (box) {
      box.replaceChildren();
      box.appendChild(makeNode("h3", "হিজরি তারিখ"));
      box.appendChild(makeNode("p", text));
      box.appendChild(makeNode(
        "p",
        "স্থানীয় চাঁদ দেখা অনুযায়ী তারিখ এক দিন এদিক-সেদিক হতে পারে।",
        "translation"
      ));
    }
  } catch {
    if (box) {
      box.textContent = "হিজরি তারিখ এখন পাওয়া যাচ্ছে না। পরে চেষ্টা করুন।";
    }

    if (quick) quick.textContent = "তথ্য পাওয়া যায়নি";
  }
}

/* ==========================================
   চলতি মাসের সেহরি ও ইফতারের সময়সূচি
   ========================================== */

async function loadRamadanCalendar() {
  const city = $("ramadanCity")?.value.trim() || "Dhaka";
  const box = $("ramadanInfo");
  if (!box) return;

  box.textContent = "সময়সূচি লোড হচ্ছে…";

  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const url =
      "https://api.aladhan.com/v1/calendarByCity/" +
      year + "/" + month +
      "?city=" + encodeURIComponent(city) +
      "&country=Bangladesh&method=1";

    const result = await getJSON(url);

    if (!Array.isArray(result.data)) {
      throw new Error("সময়সূচি পাওয়া যায়নি।");
    }

    box.replaceChildren();
    box.appendChild(makeNode("h3", city + " — চলতি মাসের সময়সূচি"));
    box.appendChild(makeNode(
      "p",
      "এটি চলতি গ্রেগরিয়ান মাসের সময়সূচি; পূর্ণ রমজান ক্যালেন্ডার নাও হতে পারে।",
      "translation"
    ));

    result.data.forEach(day => {
      const timings = day.timings || {};
      const row = makeNode("div", undefined, "prayer-row");

      row.appendChild(makeNode(
        "span",
        `তারিখ ${bnNumber(day.date?.gregorian?.day || "")} (হিজরি ${bnNumber(day.date?.hijri?.day || "")})`
      ));

      row.appendChild(makeNode(
        "strong",
        `সেহরি শেষ: ${formatTime(timings.Fajr)} · ইফতার: ${formatTime(timings.Maghrib)}`
      ));

      box.appendChild(row);
    });
  } catch {
    box.textContent =
      "সময়সূচি লোড হয়নি। ইন্টারনেট এবং শহরের ইংরেজি বানান পরীক্ষা করুন।";
  }
}

/* ==========================================
   কিবলার দিক
   ========================================== */

function calculateQibla(lat, lon) {
  const kaabaLat = 21.4225 * Math.PI / 180;
  const kaabaLon = 39.8262 * Math.PI / 180;
  const userLat = lat * Math.PI / 180;
  const userLon = lon * Math.PI / 180;
  const deltaLon = kaabaLon - userLon;

  const y = Math.sin(deltaLon);
  const x =
    Math.cos(userLat) * Math.tan(kaabaLat) -
    Math.sin(userLat) * Math.cos(deltaLon);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function setupQibla() {
  const button = $("qiblaBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    if (!navigator.geolocation) {
      setMessage("qiblaDegree", "এই ডিভাইসে অবস্থান নির্ণয়ের সুবিধা নেই।");
      return;
    }

    setMessage("qiblaDegree", "অবস্থানের অনুমতি চাইছে…");

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const degree = calculateQibla(latitude, longitude);
        const needle = $("compassNeedle");

        if (needle) {
          needle.style.transform = `rotate(${degree}deg)`;
        }

        setMessage(
          "qiblaDegree",
          "উত্তর দিক থেকে ঘড়ির কাঁটার দিকে কিবলার কোণ: " +
          bnNumber(degree.toFixed(1)) +
          "°। এটি গণনাভিত্তিক দিক; ফোনের কম্পাস সেন্সর আলাদাভাবে প্রয়োজন।"
        );
      },
      error => {
        setMessage(
          "qiblaDegree",
          error.code === 1
            ? "অবস্থানের অনুমতি দেওয়া হয়নি। ব্রাউজারের সাইট সেটিংসে অনুমতি দিন।"
            : "অবস্থান পাওয়া যায়নি। GPS চালু করে আবার চেষ্টা করুন।"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  });
}

/* ==========================================
   ডিজিটাল তাসবিহ
   ========================================== */

let tasbihCount = Number(readStore(STORE.tasbih, 0));

if (!Number.isFinite(tasbihCount) || tasbihCount < 0) {
  tasbihCount = 0;
}

function renderTasbih() {
  setMessage("tasbihCount", bnNumber(tasbihCount));
}

function setupTasbih() {
  $("tasbihBtn")?.addEventListener("click", () => {
    tasbihCount++;
    writeStore(STORE.tasbih, tasbihCount);
    renderTasbih();
  });

  $("resetBtn")?.addEventListener("click", () => {
    tasbihCount = 0;
    writeStore(STORE.tasbih, tasbihCount);
    renderTasbih();
  });

  renderTasbih();
}

/* ==========================================
   দৈনিক আমল
   ========================================== */

const amalChecks = Array.from(
  document.querySelectorAll(".amal-check")
);

function todayKey() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}

function setupAmal() {
  const all = readStore(STORE.amal, {});
  const saved = all[todayKey()] || {};

  amalChecks.forEach(check => {
    check.checked = Boolean(saved[check.value]);

    check.addEventListener("change", () => {
      const current = readStore(STORE.amal, {});
      current[todayKey()] = current[todayKey()] || {};
      current[todayKey()][check.value] = check.checked;

      writeStore(STORE.amal, current);
      renderAmalProgress();
    });
  });

  renderAmalProgress();
}

function renderAmalProgress() {
  const total = amalChecks.length;
  const checked = amalChecks.filter(item => item.checked).length;
  const percent = total
    ? Math.round((checked / total) * 100)
    : 0;

  setMessage("amalProgress", `${bnNumber(percent)}% সম্পন্ন`);

  const bar = $("amalProgressBar");
  if (bar) bar.style.width = percent + "%";
}

/* ==========================================
   যাকাতের প্রাথমিক হিসাব
   ========================================== */

function setupZakat() {
  $("zakatBtn")?.addEventListener("click", () => {
    const assets = Number($("zakatAssets")?.value);
    const debts = Number($("zakatDebts")?.value);
    const box = $("zakatInfo");

    if (!box) return;

    if (
      !Number.isFinite(assets) ||
      !Number.isFinite(debts) ||
      assets < 0 ||
      debts < 0
    ) {
      box.textContent =
        "সঠিক সংখ্যা লিখুন; সংখ্যা শূন্যের কম হতে পারবে না।";
      return;
    }

    const net = Math.max(0, assets - debts);
    const zakat = net * 0.025;

    box.replaceChildren();

    box.appendChild(makeNode(
      "p",
      "প্রাথমিক হিসাবযোগ্য নিট সম্পদ: ৳" +
      net.toLocaleString("en-BD", {
        maximumFractionDigits: 2
      })
    ));

    box.appendChild(makeNode(
      "h3",
      "২.৫% অনুযায়ী: ৳" +
      zakat.toLocaleString("en-BD", {
        maximumFractionDigits: 2
      })
    ));

    box.appendChild(makeNode(
      "p",
      "এটি প্রাথমিক হিসাব। নিসাব, সম্পদের ধরন, মালিকানার সময়কাল ও প্রযোজ্য বিধান যাচাই করে চূড়ান্ত হিসাব করুন।",
      "translation"
    ));
  });
}

/* ==========================================
   সব ইভেন্ট ও অ্যাপ চালু
   ========================================== */

function setupEvents() {
  $("prayerBtn")?.addEventListener("click", loadPrayerTimes);
  $("prayerQuickBtn")?.addEventListener("click", () => {
    const city = $("prayerCity");
    if (city) city.scrollIntoView({ behavior: "smooth", block: "center" });
    loadPrayerTimes();
  });

  $("quranBtn")?.addEventListener("click", loadSurah);
  $("playSurahBtn")?.addEventListener("click", playSurah);

  $("duaSearch")?.addEventListener("input", renderDuas);
  $("duaCategory")?.addEventListener("change", renderDuas);

  $("hadithBtn")?.addEventListener("click", showHadith);

  $("hijriBtn")?.addEventListener("click", loadHijri);
  $("hijriBtnFull")?.addEventListener("click", loadHijri);

  $("ramadanBtn")?.addEventListener("click", loadRamadanCalendar);
}

function initApp() {
  showToday();
  setupTheme();
  setupCreatorModal();
  setupNiyat();
  setupTasbih();
  setupAmal();
  setupZakat();
  setupQibla();
  setupEvents();

  renderDuas();
  renderBookmarks();
  loadSurahList();

  // ব্যবহারকারী বোতাম চাপলে অনলাইন ফিচার চালু হবে।
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => {
        console.log("Islamic Life Service Worker চালু হয়েছে।");
      })
      .catch(error => {
        console.error("Service Worker Error:", error);
      });
  });
}
