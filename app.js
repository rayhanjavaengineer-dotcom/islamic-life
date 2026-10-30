(()=>{"use strict";const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));const screens=["home","menu","prayer","quran","duas","hadith","history","prophets","companions","calendar","ramadan","qibla","tasbih","amal","zakat","quiz","mosques","saved","profile"];function show(n){if(!screens.includes(n))n="home";$$(".screen").forEach(x=>x.classList.toggle("active",x.id==="screen-"+n));$$("nav button").forEach(x=>x.style.color=x.dataset.screen===n?"#087653":"");window.scrollTo(0,0);if(n==="saved")renderSaved()}document.addEventListener("click",e=>{let b=e.target.closest("[data-screen]");if(b)show(b.dataset.screen)});$("#darkModeBtn").onclick=()=>{document.body.classList.toggle("dark");set("il-theme",document.body.classList.contains("dark"))};if(get("il-theme",false))document.body.classList.add("dark");$("#todayDate").textContent=new Intl.DateTimeFormat("bn-BD",{dateStyle:"full"}).format(new Date());let prof=get("il-profile-v1",{name:"",city:"Dhaka"});$("#profileName").value=prof.name;$("#profileCity").value=prof.city;$("#saveProfileBtn").onclick=()=>{set("il-profile-v1",{name:$("#profileName").value,city:$("#profileCity").value});$("#profileMessage").textContent="এই ডিভাইসে সংরক্ষিত হয়েছে।"};$("#creatorBtn").onclick=()=>$("#creatorModal").classList.add("open");$("#closeCreatorBtn").onclick=()=>$("#creatorModal").classList.remove("open");
let timings={};const names={Fajr:"ফজর",Sunrise:"সূর্যোদয়",Dhuhr:"যোহর",Asr:"আসর",Maghrib:"মাগরিব",Isha:"এশা"};async function prayer(){let city=$("#prayerCity").value||"Dhaka";$("#prayerInfo").textContent="লোড হচ্ছে…";try{let j=await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Bangladesh&method=1`).then(r=>r.json());if(j.code!==200)throw 0;timings=j.data.timings;$("#prayerInfo").textContent=`${j.data.date.readable} · ${city} · Method 1 (Karachi)`;$("#prayerCards").innerHTML=["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha"].map(k=>`<div class="prayer-row"><b>${names[k]}</b><strong>${timings[k]}</strong></div>`).join("");let now=new Date(),next=["Fajr","Dhuhr","Asr","Maghrib","Isha"].map(k=>{let [h,m]=timings[k].split(":");let d=new Date();d.setHours(+h,+m,0,0);let diff=(d-now)/60000;if(diff<0)diff+=1440;return{k,diff}}).sort((a,b)=>a.diff-b.diff)[0];$("#nextPrayerName").textContent=names[next.k];$("#nextPrayerCountdown").textContent=`প্রায় ${Math.floor(next.diff/60)} ঘণ্টা ${Math.floor(next.diff%60)} মিনিট বাকি`;set("il-last-prayer-times",{city,timings})}catch{$("#prayerInfo").textContent="সময়সূচি পাওয়া যায়নি; শহরের নাম ও ইন্টারনেট পরীক্ষা করুন।"}}$("#prayerBtn").onclick=prayer;let savedPrayer=get("il-last-prayer-times",null);if(savedPrayer){$("#prayerCity").value=savedPrayer.city;timings=savedPrayer.timings;$("#prayerCards").innerHTML=Object.keys(names).map(k=>`<div class="prayer-row"><b>${names[k]}</b><strong>${timings[k]||"—"}</strong></div>`).join("")}else prayer();$("#saveAzanPrefs").onclick=()=>{set("il-azan-preferences-v2",{selected:$$("[data-prayer-notify]").filter(x=>x.checked).map(x=>x.dataset.prayerNotify),reminder:$("#azanReminder").value});$("#firebasePushStatus").textContent="পছন্দ সংরক্ষিত হয়েছে।"};$("#azanNotifyBtn").onclick=async()=>{if(!("Notification"in window)){alert("Notification সমর্থিত নয়");return}let p=await Notification.requestPermission();$("#firebasePushStatus").textContent=p==="granted"?"অনুমতি দেওয়া হয়েছে; scheduled push backend এখনো প্রয়োজন।":"অনুমতি দেওয়া হয়নি।"};
let surahs=[];async function initQ(){try{let j=await fetch("https://api.alquran.cloud/v1/surah").then(r=>r.json());surahs=j.data;$("#surahSelect").innerHTML='<option value="">সূরা নির্বাচন</option>'+surahs.map(s=>`<option value="${s.number}">${s.number}. ${s.name} — ${s.englishName}</option>`).join("")}catch{}}initQ();$("#surahSearch").oninput=e=>$$("option",$("#surahSelect")).forEach((o,i)=>{if(i)o.hidden=!o.textContent.toLowerCase().includes(e.target.value.toLowerCase())});async function quran(){let n=$("#surahSelect").value;if(!n)return;$("#quranInfo").textContent="লোড হচ্ছে…";try{let [a,b]=await Promise.all([fetch(`https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`).then(r=>r.json()),fetch(`https://api.alquran.cloud/v1/surah/${n}/bn.bengali`).then(r=>r.json())]);$("#quranInfo").innerHTML=a.data.ayahs.map((x,i)=>`<article class="ayah"><div class="ayah-ar">${x.text}</div><p>${b.data.ayahs[i].text}</p><small>আয়াত ${x.numberInSurah}</small> <button data-bookmark="${n}:${x.numberInSurah}">♡</button></article>`).join("");$("#quranAudio").src=`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;$("#audioTitle").textContent=a.data.name}catch{$("#quranInfo").textContent="সূরা লোড হয়নি"}}$("#quranBtn").onclick=quran;$("#playSurahBtn").onclick=()=>$("#quranAudio").play().catch(()=>{});document.addEventListener("click",e=>{let b=e.target.closest("[data-bookmark]");if(!b)return;let a=get("im-muslim-bookmarks",[]);if(!a.includes(b.dataset.bookmark))a.push(b.dataset.bookmark);set("im-muslim-bookmarks",a);b.textContent="✓";renderSaved()});function renderSaved(){let a=get("im-muslim-bookmarks",[]);$("#savedList").innerHTML=a.length?a.map(x=>`<div class="info-card">সূরা ${x.split(":")[0]} · আয়াত ${x.split(":")[1]}</div>`).join(""):"এখনও কিছু সংরক্ষিত নেই"}
const dua=[["খাওয়ার আগে","بِسْمِ اللَّهِ","আল্লাহর নামে শুরু করছি।","সুনান আবু দাউদ ৩৭৬৭"],["নিয়তের গুরুত্ব","إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ","নিশ্চয়ই কাজ নিয়তের ওপর নির্ভরশীল।","সহিহ বুখারি ১"]];function renderDua(){let q=$("#duaSearch").value.toLowerCase();$("#duaList").innerHTML=dua.filter(x=>x.join(" ").toLowerCase().includes(q)).map(x=>`<div class="info-card"><h3>${x[0]}</h3><p class="ayah-ar">${x[1]}</p><p>${x[2]}</p><small>${x[3]}</small></div>`).join("")}$("#duaSearch").oninput=renderDua;renderDua();$("#hadithInfo").innerHTML=[["নিয়তের গুরুত্ব","নিশ্চয়ই সকল কাজ নিয়তের ওপর নির্ভরশীল।","সহিহ বুখারি ১; সহিহ মুসলিম ১৯০৭"],["সহজতা","দ্বীন সহজ।","সহিহ বুখারি ৩৯"]].map(x=>`<div class="info-card"><h3>${x[0]}</h3><p>${x[1]}</p><small>${x[2]}</small></div>`).join("");
const hist=[["নবুয়তের সূচনা","মক্কায় প্রথম ওহি অবতরণের মাধ্যমে নবুয়তি অধ্যায়ের সূচনা।","কুরআন ৯৬:১–৫; সীরাতের প্রাথমিক গ্রন্থ।"],["হিজরত","মক্কা থেকে মদিনায় হিজরত মুসলিম ইতিহাসে গুরুত্বপূর্ণ মোড়।","কুরআন ৯:৪০; প্রাথমিক সীরাত-সাহিত্য।"],["খুলাফায়ে রাশেদিন","প্রথম চার খলিফার যুগ প্রাথমিক মুসলিম ইতিহাসের গুরুত্বপূর্ণ অধ্যায়।","ইবন সা'দ, আল-বালাধুরি; আধুনিক গবেষণা।"],["মুসলিম জ্ঞানচর্চা","বিভিন্ন যুগে চিকিৎসা, গণিত, জ্যোতির্বিজ্ঞান ও স্থাপত্যে মুসলিম সমাজের অবদান।","Oxford Islamic History; আঞ্চলিক ইতিহাসগ্রন্থ।"]];$("#historyList").innerHTML=hist.map(x=>`<div class="info-card"><h3>${x[0]}</h3><p>${x[1]}</p><small>পাঠসূত্র: ${x[2]}</small></div>`).join("");let prophets=["আদম","ইদ্রিস","নূহ","হুদ","সালিহ","ইবরাহিম","লূত","ইসমাইল","ইসহাক","ইয়াকুব","ইউসুফ","আইয়ুব","শুআইব","মূসা","হারুন","যুলকিফল","দাউদ","সুলাইমান","ইলিয়াস","আল-ইয়াসা","ইউনুস","যাকারিয়া","ইয়াহইয়া","ঈসা","মুহাম্মদ ﷺ"];$("#prophetList").innerHTML=prophets.map((x,i)=>`<div class="info-card">${i+1}. ${x}<p class="muted">কুরআনে উল্লেখিত নবী; বিস্তারিত জানতে সংশ্লিষ্ট আয়াত ও নির্ভরযোগ্য তাফসির পড়ুন।</p></div>`).join("");$("#companionList").innerHTML=[["আবু বকর (রা.)","প্রথম খলিফা; প্রাথমিক মুসলিম সমাজে গুরুত্বপূর্ণ ভূমিকা।"],["উমর (রা.)","দ্বিতীয় খলিফা; প্রশাসনিক ও রাষ্ট্রীয় ইতিহাসে গুরুত্বপূর্ণ।"],["উসমান (রা.)","তৃতীয় খলিফা; মুসহাফের মান্য পাঠ সংরক্ষণ-প্রচেষ্টার সঙ্গে যুক্ত।"],["আলী (রা.)","চতুর্থ খলিফা; প্রাথমিক ইসলামের গুরুত্বপূর্ণ ব্যক্তিত্ব।"],["খাদিজা (রা.)","প্রথম ঈমান গ্রহণকারীদের একজন।"],["আয়িশা (রা.)","হাদিস ও জ্ঞানচর্চায় বিশিষ্ট বর্ণনাকারী।"]].map(x=>`<div class="info-card"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join("");
async function hijri(){try{let d=new Date(),s=`${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`,j=await fetch(`https://api.aladhan.com/v1/gToH?date=${s}`).then(r=>r.json()),h=j.data.hijri;$("#hijriInfo").textContent=`${h.day} ${h.month.en} ${h.year} AH`;$("#hijriQuick").textContent=$("#hijriInfo").textContent}catch{$("#hijriInfo").textContent="তারিখ পাওয়া যায়নি"}}$("#hijriBtnFull").onclick=hijri;hijri();$("#ramadanBtn").onclick=async()=>{let d=new Date(),city=$("#ramadanCity").value||"Dhaka";try{let j=await fetch(`https://api.aladhan.com/v1/calendarByCity/${d.getFullYear()}/${d.getMonth()+1}?city=${encodeURIComponent(city)}&country=Bangladesh&method=1`).then(r=>r.json());$("#ramadanInfo").innerHTML=j.data.slice(0,10).map(x=>`<div class="info-card">${x.date.readable}<p>সেহরি শেষ ${x.timings.Fajr} · ইফতার ${x.timings.Maghrib}</p></div>`).join("")}catch{$("#ramadanInfo").textContent="সময়সূচি পাওয়া যায়নি"}};
function qibla(lat,lon){let p1=lat*Math.PI/180,p2=21.4225*Math.PI/180,dl=(39.8262-lon)*Math.PI/180;return(Math.atan2(Math.sin(dl),Math.cos(p1)*Math.tan(p2)-Math.sin(p1)*Math.cos(dl))*180/Math.PI+360)%360}$("#qiblaBtn").onclick=()=>navigator.geolocation?.getCurrentPosition(p=>{let d=qibla(p.coords.latitude,p.coords.longitude);$("#qiblaDegree").textContent=Math.round(d)+"°";$("#compassNeedle").style.transform=`rotate(${d}deg)`},()=>$("#qiblaDegree").textContent="লোকেশন অনুমতি দিন");
let count=get("im-muslim-tasbih",0);$("#tasbihCount").textContent=count;$("#tasbihBtn").onclick=()=>{$("#tasbihCount").textContent=++count;set("im-muslim-tasbih",count)};$("#resetBtn").onclick=()=>{count=0;set("im-muslim-tasbih",0);$("#tasbihCount").textContent=0};
let ak="il-amal-"+new Date().toISOString().slice(0,10),amal=get(ak,[]);$$(".amal-check").forEach((x,i)=>{x.checked=!!amal[i];x.onchange=()=>{amal=$$(".amal-check").map(y=>y.checked);set(ak,amal);renderAmal()}});function renderAmal(){let n=amal.filter(Boolean).length;$("#amalProgress").textContent=`${n}/5 সম্পন্ন` ;$("#amalProgressBar").style.width=(n/5*100)+"%";$("#dailySummary").textContent=`আজ ${n}টি আমল সম্পন্ন।`}renderAmal();$("#zakatBtn").onclick=()=>{let net=Math.max(0,(+$("#zakatAssets").value||0)-(+$("#zakatDebts").value||0));$("#zakatInfo").textContent=`নিট সম্পদ ৳${net.toLocaleString("en-BD")} · আনুমানিক যাকাত ২.৫% = ৳${(net*.025).toLocaleString("en-BD")}. নিসাব, হাওল ও সম্পদের ধরন যাচাই করুন।`};
let quiz=[["কুরআনের প্রথম অবতীর্ণ আয়াত কোন সূরায়?",["ফাতিহা","আল-আলাক","ইখলাস"],1,"সূরা আল-আলাক ৯৬:১–৫"],["কিবলা কোনটি?",["কাবা","মসজিদে নববি","মসজিদুল আকসা"],0,"কাবা শরিফ"]],qi=0;function drawQuiz(){let q=quiz[qi];$("#quizQuestion").textContent=q[0];$("#quizOptions").innerHTML=q[1].map((x,i)=>`<button data-ans="${i}">${x}</button>`).join("")}$("#quizStartBtn").onclick=()=>{qi=0;drawQuiz()};$("#quizNextBtn").onclick=()=>{qi=(qi+1)%quiz.length;drawQuiz()};$("#quizOptions").onclick=e=>{let b=e.target.closest("[data-ans]");if(!b)return;let q=quiz[qi];$("#quizFeedback").textContent=+b.dataset.ans===q[2]?"সঠিক! "+q[3]:"সঠিক উত্তর: "+q[1][q[2]];$$("[data-ans]").forEach(x=>x.disabled=true)};$("#mosqueBtn").onclick=()=>window.open("https://www.google.com/maps/search/mosque+near+me/","_blank","noopener");$("#languageSelect").onchange=()=>{if($("#languageSelect").value==="en")alert("এই সংস্করণের মূল ভাষা বাংলা; পূর্ণ English localization পরবর্তী কনটেন্ট কাজ।")};if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();

/* ==========================================
   নতুন আপডেট: Navigation + বাংলা/English
   + Saved Ayat
   ========================================== */

const EXTRA_STORE = {
  language: "im-muslim-language"
};

/* ১. বাংলা ও ইংরেজি অনুবাদ */
const translations = {
  "আসসালামু আলাইকুম": "Assalamu Alaikum",
  "আপনার প্রতিদিনের": "Your Daily",
  "ইসলামিক সঙ্গী": "Islamic Companion",
  "পরবর্তী নামাজ": "Next Prayer",
  "নামাজের সময়": "Prayer Times",
  "শহর অনুযায়ী সময় দেখুন": "View prayer times by city",
  "সকল বিভাগ": "All Categories",
  "হোম": "Home",
  "মেনু": "Menu",
  "কুরআন": "Quran",
  "আল-কুরআন": "The Holy Quran",
  "নামাজ ও আজান": "Prayer & Adhan",
  "দোয়া ও জিকির": "Duas & Dhikr",
  "হাদিস": "Hadith",
  "ইসলামের ইতিহাস": "Islamic History",
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
  "মসজিদ খুঁজুন": "Find a Mosque",
  "মসজিদ": "Mosques",
  "সংরক্ষিত": "Saved",
  "প্রোফাইল": "Profile",
  "নামাজের সময়": "Prayer Times",
  "সময় দেখুন": "Show Times",
  "শহর": "City",
  "আজানের নোটিফিকেশন": "Adhan Notifications",
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
  "দোয়া ও জিকির": "Duas & Dhikr",
  "খুঁজুন": "Search",
  "সব": "All",
  "দৈনন্দিন": "Daily",
  "সকাল-সন্ধ্যা": "Morning & Evening",
  "আজকের হিজরি তারিখ": "Today's Hijri Date",
  "সময়সূচি": "Schedule",
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
  "Founder & Creator": "Founder & Creator",
  "জ্ঞান, ইবাদত ও উপকারী প্রযুক্তির উদ্যোগ।": "An initiative for knowledge, worship and useful technology.",
  "বাংলা উচ্চারণ": "Pronunciation",
  "অর্থ": "Meaning",
  "উৎস": "Source",
  "আয়াত সংরক্ষণ": "Save Ayah",
  "আরবি কপি": "Copy Arabic",
  "সংরক্ষণ থেকে সরান": "Remove from Saved",
  "কোনো দোয়া পাওয়া যায়নি।": "No dua found.",
  "কোনো সূরা পাওয়া যায়নি": "No Surah found",
  "প্রথমে একটি সূরা নির্বাচন করুন।": "Please select a Surah first.",
  "কপি করা হয়েছে।": "Copied successfully.",
  "কপি করা যায়নি।": "Could not copy.",
  "এখনো কোনো আয়াত সংরক্ষণ করা হয়নি।": "No ayahs saved yet.",
  "তারিখ": "Date",
  "নির্মাতা": "Creator",
  "পরবর্তী নামাজ": "Next Prayer"
};

/* ২. ভাষা সংরক্ষণ */
let appLanguage = localStorage.getItem(EXTRA_STORE.language) || "bn";

function translatePage() {
  const isEnglish = appLanguage === "en";

  document.documentElement.lang = appLanguage;

  // সাধারণ লেখা অনুবাদ
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const original = node.textContent;
    const trimmed = original.trim();

    if (!trimmed) return;

    if (isEnglish && translations[trimmed]) {
      node.textContent = original.replace(
        trimmed,
        translations[trimmed]
      );
    } else if (!isEnglish) {
      const englishToBangla = Object.fromEntries(
        Object.entries(translations).map(([bn, en]) => [en, bn])
      );

      if (englishToBangla[trimmed]) {
        node.textContent = original.replace(
          trimmed,
          englishToBangla[trimmed]
        );
      }
    }
  });

  // ইনপুটের placeholder
  document.querySelectorAll("input, textarea").forEach(input => {
    const value = input.getAttribute("placeholder");
    if (!value) return;

    if (isEnglish && translations[value]) {
      input.dataset.bnPlaceholder = value;
      input.placeholder = translations[value];
    } else if (!isEnglish && input.dataset.bnPlaceholder) {
      input.placeholder = input.dataset.bnPlaceholder;
    }
  });

  // ইংরেজিতে সংখ্যা
  if (isEnglish) {
    document.querySelectorAll("#tasbihCount, #amalProgress").forEach(el => {
      el.textContent = el.textContent.replace(/[০-৯]/g, d =>
        "০১২৩৪৫৬৭৮৯".indexOf(d)
      );
    });
  }
}

/* ৩. ভাষা পরিবর্তনের বোতাম */
function setupLanguage() {
  const select = document.getElementById("languageSelect");
  if (!select) return;

  select.value = appLanguage;
  translatePage();

  select.addEventListener("change", () => {
    appLanguage = select.value;
    localStorage.setItem(EXTRA_STORE.language, appLanguage);
    translatePage();
  });
}

/* ৪. পেজ নেভিগেশন */
function setupNavigation() {
  const buttons = document.querySelectorAll("[data-screen]");
  const screens = document.querySelectorAll(".screen");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.screen;

      screens.forEach(screen => {
        screen.classList.toggle(
          "active",
          screen.id === "screen-" + target
        );
      });

      document.querySelectorAll("nav [data-screen]").forEach(navButton => {
        navButton.classList.toggle(
          "active",
          navButton.dataset.screen === target
        );
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      if (target === "saved") {
        renderSavedPage();
      }

      if (target === "hadith") {
        showHadith();
      }
    });
  });
}

/* ৫. সংরক্ষিত আয়াত আলাদা পেজেও দেখানো */
function renderSavedPage() {
  const list = $("bookmarkListSaved");
  if (!list) return;

  list.replaceChildren();

  if (!bookmarkData.length) {
    list.appendChild(makeNode(
      "p",
      appLanguage === "en"
        ? "No saved ayahs yet."
        : "এখনো কোনো আয়াত সংরক্ষণ করা হয়নি।",
      "muted"
    ));
    return;
  }

  bookmarkData.forEach((item, index) => {
    const card = makeNode("article", undefined, "content-card");

    card.appendChild(makeNode(
      "h3",
      `${item.surahName || "সূরা"} — ${appLanguage === "en" ? "Ayah" : "আয়াত"} ${item.ayah}`
    ));

    card.appendChild(makeNode("p", item.arabic || "", "arabic-text"));

    if (item.bangla) {
      card.appendChild(makeNode("p", item.bangla));
    }

    addButton(
      card,
      appLanguage === "en" ? "Remove" : "সংরক্ষণ থেকে সরান",
      () => {
        bookmarkData.splice(index, 1);
        writeStore(STORE.bookmarks, bookmarkData);
        renderSavedPage();
        renderBookmarks();
      }
    );

    list.appendChild(card);
  });
}

/* ৬. আগের bookmark render-এর সঙ্গে Saved page যুক্ত */
const originalRenderBookmarks = renderBookmarks;

renderBookmarks = function () {
  originalRenderBookmarks();
  renderSavedPage();
};

/* ৭. নেভিগেশন ও ভাষা চালু */
function initExtraFeatures() {
  setupNavigation();
  setupLanguage();
  renderSavedPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExtraFeatures);
} else {
  initExtraFeatures();
}
