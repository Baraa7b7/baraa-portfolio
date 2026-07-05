// ─────────────────────────────────────────────────────────────────────────────
// js/i18n.js — Bilingual content + locale state
//
// Arabic is the default locale. State lives in memory only (no localStorage).
// Static DOM text is driven by [data-i18n] / [data-i18n-attr] attributes;
// JS-rendered sections (work, contact) subscribe via onLocaleChange().
//
//   data-i18n="about.body"                  → textContent
//   data-i18n-attr="alt:intro.imgAlt"       → attribute(s), ';'-separated pairs
// ─────────────────────────────────────────────────────────────────────────────

export const translations = {
  ar: {
    meta: {
      title: 'براء عبدالوهاب — بين الثبات والحركة',
      description: 'براء عبدالوهاب — استشاري تقني ميداني ومتخصص تثبيت الكاميرا (DJI Ronin, ARRI Trinity).',
    },
    langToggle: {
      ariaLabel: 'تبديل اللغة',
    },
    intro: {
      ariaLabel: 'مقدمة',
      imgAlt: 'براء عبدالوهاب — استشاري تقني ميداني',
    },
    about: {
      ariaLabel: 'عن براء',
      label: '٠٢ — نبذة',
      heading: 'استشاري تقني ميداني\nومتخصص تثبيت الكاميرا',
      body: 'أعمل في قلب الإنتاج — حيث تلتقي الكاميرا باللحظة. متخصص في أنظمة تثبيت الكاميرا DJI Ronin وARRI Trinity، واستشاري تقني ميداني في المشاريع التلفزيونية الكبرى والإعلانات التجارية.',
      credit1: 'Arabs Got Talent S7 — MBC',
      credit2: 'Boulevard Al-Mawaheb — MBC',
      credit3: 'Netflix · Pepsi · Toyota · Maserati',
      portraitAlt: 'براء عبدالوهاب مع معدات ARRI Trinity',
    },
    work: {
      ariaLabel: 'الأعمال',
      label: '٠٣ — الأعمال',
      title: 'أعمال مختارة',
    },
    numbers: {
      ariaLabel: 'الأرقام',
      label: '٠٤ — الأرقام',
      heading: 'أرقام من الميدان',
      stats: {
        years: 'سنوات في الميدان',
        productions: 'إنتاجًا وحملة تجارية',
        hours: 'ساعة على مواقع التصوير',
        clients: 'جهة إنتاج وعلامة كبرى',
      },
    },
    clients: {
      ariaLabel: 'العملاء',
      label: '٠٥ — عملاء وشركاء',
      title: 'ثقة تتكرر',
    },
    contact: {
      ariaLabel: 'تواصل',
      label: '٠٦ — تواصل',
      tagline: 'الكادر التالي — لك',
      labels: {
        whatsapp: 'واتساب',
        email: 'البريد',
        imdb: 'IMDb',
        instagram: 'إنستغرام',
      },
    },
  },

  en: {
    meta: {
      title: 'Baraa Abdulwahab — Between Stillness and Motion',
      description: 'Baraa Abdulwahab — On-Set Technical Consultant & Camera Stabilization Specialist (DJI Ronin, ARRI Trinity).',
    },
    langToggle: {
      ariaLabel: 'Switch language',
    },
    intro: {
      ariaLabel: 'Introduction',
      imgAlt: 'Baraa Abdulwahab — On-Set Technical Consultant',
    },
    about: {
      ariaLabel: 'About Baraa',
      label: '02 — About',
      heading: 'On-Set Technical Consultant\n& Camera Stabilization Specialist',
      body: 'I work at the heart of production — where the camera meets the moment. A specialist in DJI Ronin and ARRI Trinity camera stabilization systems, and an on-set technical consultant for major television productions and commercial campaigns.',
      credit1: 'Arabs Got Talent S7 — MBC',
      credit2: 'Boulevard Al-Mawaheb — MBC',
      credit3: 'Netflix · Pepsi · Toyota · Maserati',
      portraitAlt: 'Baraa Abdulwahab with the ARRI Trinity rig',
    },
    work: {
      ariaLabel: 'Work',
      label: '03 — Work',
      title: 'Selected Work',
    },
    numbers: {
      ariaLabel: 'The numbers',
      label: '04 — The Numbers',
      heading: 'Proof in numbers',
      stats: {
        years: 'Years in the field',
        productions: 'Productions & campaigns',
        hours: 'Hours on set',
        clients: 'Major networks & brands',
      },
    },
    clients: {
      ariaLabel: 'Clients',
      label: '05 — Clients & Partners',
      title: 'Trust, repeated',
    },
    contact: {
      ariaLabel: 'Contact',
      label: '06 — Contact',
      tagline: 'The next frame is yours',
      labels: {
        whatsapp: 'WhatsApp',
        email: 'Email',
        imdb: 'IMDb',
        instagram: 'Instagram',
      },
    },
  },
};

let locale = 'ar';
const listeners = [];

export function getLocale() {
  return locale;
}

export function t(path) {
  const value = path.split('.').reduce((node, key) => (node ? node[key] : undefined), translations[locale]);
  return value !== undefined ? value : path;
}

export function onLocaleChange(fn) {
  listeners.push(fn);
}

export function setLocale(next) {
  if (!translations[next] || next === locale) return;
  locale = next;

  const html = document.documentElement;
  html.lang = next;
  html.dir = next === 'ar' ? 'rtl' : 'ltr';

  applyStatic();
  listeners.forEach((fn) => fn(locale));
}

export function applyStatic() {
  document.title = t('meta.title');
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t('meta.description'));
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', t('meta.title'));
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', t('meta.description'));

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
}
