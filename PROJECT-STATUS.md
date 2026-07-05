# حالة المشروع — بورتفوليو براء عبدالوهاب

> آخر تحديث: 2026-07-05 · آخر كوميت: `12dc536` — Add GSAP/Lenis animation stack, preloader, scroll dots, and SEO meta

موقع بورتفوليو سينمائي أحادي الصفحة (Vanilla HTML/CSS/JS، بدون build tools)، ثنائي اللغة عربي/إنجليزي مع دعم RTL كامل، يُنشر على GitHub Pages. الهدف: دعم ملف الاعتماد لمهرجان San Sebastián 2026 وطلب الفيزا الإسبانية.

---

## 1) البنية الحالية للملفات

```
baraa-portfolio/
├── index.html                  ← الصفحة الوحيدة: 6 سكاشن + preloader + scroll dots
│                                  + سكربتات CDN (GSAP/ScrollTrigger من cdnjs،
│                                  Lenis/SplitType من jsDelivr) + module script رئيسي
├── CLAUDE.md                   ← مرجع التصميم والقرارات الدائم
├── OLD_CLAUDE_BACKUP.md        ← نسخة قديمة (مرشّحة للحذف)
│
├── css/
│   ├── reset.css               ← تصفير الأنماط
│   ├── tokens.css              ← متغيرات الألوان/الخطوط/المقاسات (--bg-*, --accent-gold…)
│   ├── main.css                ← عام: preloader، scroll dots، إيقاع السكاشن
│   ├── lang-toggle.css         ← زر AR|EN + الـ cross-fade الاحتياطي
│   └── section-{1..6}-*.css    ← ملف لكل سكشن (intro, about, work, numbers, clients, contact)
│
├── js/
│   ├── i18n.js                 ← كل نصوص الواجهة AR/EN + setLocale/applyStatic/onLocaleChange
│   ├── content.js              ← البيانات: CONTACT + WORKS (9 مشاريع) + CLIENTS (10 شعارات)
│   ├── smooth.js               ← Lenis مربوط بـ gsap.ticker + ScrollTrigger.update
│   ├── main.js                 ← ⚠️ ملف ميت من نسخة قديمة (غير مستورد — انظر القسم 4)
│   └── sections/
│       ├── intro.js            ← تسلسل الافتتاح: lamp-on → push-in → shake → breathing
│       ├── lang-toggle.js      ← تبديل اللغة مع GSAP body fade
│       ├── about.js            ← reveal بـ ScrollTrigger + تقسيم العنوان كلمات + parallax
│       ├── work.js             ← المعرض الأفقي المثبّت (pin + scrub) + fallback موبايل
│       ├── numbers.js          ← عدّادات count-up بأرقام هندية/غربية حسب اللغة
│       ├── clients.js          ← marquee شعارات لا نهائي
│       └── contact.js          ← روابط التواصل + timecode حي + تقسيم الـ tagline
│
├── images/
│   ├── intro/                  ← intro-bg-{ar,en}.webp للديسكتوب + intro-bg-{ar,en}-mobile.webp للموبايل
│   ├── projects/               ← 9 صور مشاريع (كلها مربوطة في content.js)
│   ├── clients/                ← 12 شعار (10 مربوطة + 2 وزارات غير مربوطة — انظر القسم 3)
│   └── equipment/              ← ARRI_Trinity.webp (مستخدمة في About) + Ronin.png
│
├── assets/hero/hero.jpg        ← ⚠️ غير مستخدمة في أي مكان
└── .github/workflows/static.yml ← نشر تلقائي على GitHub Pages
```

---

## 2) الفيچرز المكتملة ✅

### السكاشن
- **Preloader** — شاشة سوداء بالاسم بخط mono، تختفي بعد `window.load + 800ms`، وتسلسل الافتتاح لا يبدأ إلا بعد إزالتها.
- **01 Intro** — تسلسل سينمائي كامل: أسود → إضاءة المصباح (1.2s) → push-in (scale 1.03) → اهتزاز lerp مزدوج الطبقات → تنفّس لا نهائي (rAF). خلفية لكل لغة (intro-bg-ar / intro-bg-en) مع preload للاثنتين فلا يحدث وميض عند التبديل.
- **02 About** — نبذة + كريدتس + صورة معدات ARRI Trinity، ظهور بـ GSAP، العنوان ينقسم كلمات بـ SplitType مع stagger ‏0.04s، وparallax تفاضلي (النص يصعد والصورة تنزل).
- **03 Work** — معرض أفقي مثبّت بـ ScrollTrigger (pin + scrub)، 9 مشاريع ببطاقات كبيرة (76vw) وأرقام عملاقة خلفها، parallax عكسي للصور، عدّاد تقدّم بأرقام هندية بالعربي، والاتجاه يتبع لغة القراءة (RTL يمين→يسار) ويُعاد بناؤه حيًّا عند تبديل اللغة. موبايل/reduced-motion: كاروسيل scroll-snap أصلي.
- **04 Numbers** — 4 إحصائيات count-up (‏1.8s، متدرجة)؛ سنوات الخبرة تُحسب تلقائيًا من 2021.
- **05 Clients** — marquee أحادي اللون لا نهائي (مجموعتان متطابقتان لحلقة سلسة)، مدته تتناسب مع عدد الشعارات، اتجاهه يتبع الـ dir.
- **06 Contact** — الـ tagline ينقسم حروفًا بالإنجليزي و**كلمات بالعربي** (حفاظًا على اتصال الحروف)، روابط واتساب/إيميل/إنستغرام بأيقونات خطية، عدّاد timecode حقيقي ‏24fps يعمل فقط عند ظهور السكشن، خط أفق.

### البنية التحتية
- **i18n كامل** — عربي افتراضي، تبديل AR|EN يقلب `lang` و`dir`، النصوص عبر `data-i18n`/`onLocaleChange`، الأرقام تتحوّل هندية/غربية، وintro/work/about/contact تعيد بناء أنيميشناتها بعد التبديل. انتقال التبديل: fade للـ body بـ GSAP (0.2s) + `ScrollTrigger.refresh()`.
- **Lenis smooth scroll** — يعمل من gsap.ticker بساعة واحدة مع ScrollTrigger.
- **Scroll dots** — 6 نقاط ثابتة يمين الشاشة، النشطة ذهبية، النقر يستخدم Lenis، مخفية على الموبايل، وaria-labels تتبع اللغة.
- **SEO** — favicon SVG مضمّن (placeholder)، og:title/description/image/url، twitter card، وog:title/description يتزامنان مع اللغة.
- **إتاحة واحترام التفضيلات** — `prefers-reduced-motion` محترم في كل سكشن (fallback ثابت أو CSS)، fallback كامل لو انحجبت مكتبات الـ CDN، أزرار البطاقات تعمل بالكيبورد، والتنقّل بالـ Tab داخل المعرض المثبّت يحرّك السكرول للبطاقة الصحيحة.
- **نشر** — GitHub Actions ينشر تلقائيًا على GitHub Pages عند الدفع إلى main.

---

## 3) الفيچرز الناقصة أو المعلقة ⏳

1. **صفحات تفاصيل المشاريع** — البطاقات معرّفة كأزرار (`role="button"` + cursor pointer + تفعيل بالكيبورد) لكن **النقر لا يفعل شيئًا حاليًا**. CLAUDE.md ينص على فتح عرض تفاصيل داخلي لكل مشروع. هذه أكبر فجوة وظيفية.
2. **أرقام سكشن Numbers placeholder** — ‏40+ إنتاج، 5000+ ساعة، 12+ جهة كلها أرقام مؤقتة معلّمة `TODO(baraa)` بانتظار الأرقام الحقيقية.
3. **شعارا الوزارتين غير معروضين** — `ministry of foreign .png` و`ministry of sport.png` مرفوعان في المستودع لكن غير مضافين لمصفوفة `CLIENTS` في content.js (يُفضّل قبلها إعادة تسميتهما — انظر القسم 4).
4. **عناصر من رؤية CLAUDE.md لم تُنفّذ بعد** (القسم 5 من CLAUDE.md):
   - الـ crosshair الذي يتبع المؤشر
   - الـ film grain
   - الـ shutter flash بين المشاريع
   - الدخان (سكشن 01 و05)
   - الـ headlight sweep (استُبدل تسلسل الافتتاح بمفهوم المصباح/الاهتزاز/التنفس — قرار واقعي، لكنه انحراف موثّق عن النص الأصلي)
   - خط الأفق المتحرك مع السكرول (موجود ثابتًا في Contact فقط)
5. **قفل السكرول أثناء الافتتاح** — CLAUDE.md ينص على منع السكرول حتى اكتمال التسلسل؛ التنفيذ الحالي لا يقفل السكرول.
6. **صور حقيقية BTS** — سكشن About يستخدم صورة معدات فقط؛ لا يوجد بورتريه حقيقي لبراء ولا لقطة BTS ليلية كما في الرؤية (`assets/hero/hero.jpg` موجودة لكن غير مستخدمة).
7. **الخطوط تخالف مرجع CLAUDE.md** — المنفّذ: Space Grotesk + IBM Plex Sans Arabic + JetBrains Mono؛ المرجع ينص على Cormorant Garamond + Inter. (تغيير متعمّد من جلسة سابقة — يحتاج إما تحديث CLAUDE.md أو الرجوع للخطوط الأصلية.)

---

## 4) مشاكل معروفة ⚠️

1. **`js/main.js` ملف ميت** — بقايا نسخة قديمة: يستورد `IDENTITY` من content.js (**غير موجود**) ويستهدف عناصر `#entry`/`#scrollCue` (**غير موجودة**). غير مستورد من index.html فلا يضر حاليًا، لكنه سيكسر الصفحة لو استورده أحد. الأنسب حذفه.
2. **تغييرات غير مدفوعة في شجرة العمل** — صور intro المعدّلة + نسختا الموبايل الجديدتان + دعم `<picture>` الديسكتوب/موبايل في الكود، كلها بانتظار الكوميت.
3. **أسماء ملفات بمسافات** — `ministry of foreign .png` (فيها مسافة قبل الامتداد أيضًا) و`ministry of sport.png` تخالف قاعدة التسمية في CLAUDE.md (lowercase-hyphenated) وتسبب مشاكل في الروابط. أعد تسميتهما قبل ربطهما.
4. **`OLD_CLAUDE_BACKUP.md` وأصول غير مستخدمة** — النسخة الاحتياطية القديمة، `assets/hero/hero.jpg`، `images/equipment/Ronin.png`، وملفا upscalemedia — كلها وزن ميت في المستودع.
5. **بيئات الـ CDN** — cdnjs لا يستضيف Lenis وSplitType (تم التحقق: 404)، لذا يُحمَّلان من jsDelivr. لو انحجب أي CDN يعمل الموقع بالـ fallback بدون أنيميشن — سلوك مقصود لكن يستحق التذكّر.
6. **عدّاد HTML الابتدائي `01 / 08`** — مكتوب يدويًا في index.html بينما المشاريع 9؛ الـ JS يصححه فورًا، لكن يظهر خطأً لو تعطّل الـ JS (تجميلي).
7. **og:image مربوطة برابط raw.githubusercontent** — تعمل، لكنها تعرض صورة الافتتاح العربية دائمًا ولا تتبدل مع اللغة (مقبول لبطاقات المشاركة، مذكور للعلم).

---

## الخطوات المقترحة بالأولوية

1. عرض تفاصيل المشاريع عند النقر (أكبر فجوة وظيفية + منصوص عليها في CLAUDE.md).
2. الأرقام الحقيقية لسكشن Numbers من براء.
3. إعادة تسمية شعاري الوزارتين وإضافتهما للـ marquee.
4. حسم صور intro المعدّلة غير المدفوعة.
5. تنظيف: حذف js/main.js وOLD_CLAUDE_BACKUP.md والأصول غير المستخدمة.
6. قرار بشأن العناصر السينمائية المتبقية (grain / crosshair / smoke / shutter flash) — تنفيذ أو شطب من الرؤية.
