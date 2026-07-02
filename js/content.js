// ─────────────────────────────────────────────────────────────────────────────
// js/content.js — Data. All UI copy lives in js/i18n.js; project/client data
// here carries per-locale fields where the value differs between languages.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACT = {
  email: 'baraaabdulwahab1@gmail.com',
  whatsapp: 'https://wa.me/966505154962',
  whatsappDisplay: '+966 50 515 4962',
  instagram: 'https://www.instagram.com/baraa_abdul_wahab/',
  instagramHandle: '@baraa_abdul_wahab',
};

const ROLE = {
  stabilization: {
    ar: 'متخصص تثبيت الكاميرا',
    en: 'Camera Stabilization Specialist',
  },
  consultant: {
    ar: 'استشاري تقني ميداني',
    en: 'On-Set Technical Consultant',
  },
};

export const WORKS = [
  {
    id: 'agt-s7',
    title: { ar: 'عرب غوت تالنت — الموسم السابع', en: 'Arabs Got Talent S7' },
    year: '2022',
    role: ROLE.stabilization,
    client: 'MBC',
    image: 'images/projects/agt-s7-01.jpg',
  },
  {
    id: 'boulevard',
    title: { ar: 'بوليفارد المواهب', en: 'Boulevard Al-Mawaheb' },
    year: '2023',
    role: ROLE.consultant,
    client: 'MBC',
    image: 'images/projects/trad-01.jpeg',
  },
  {
    id: 'alsaa-kam',
    title: { ar: 'الساعة كم', en: 'Al-Saa Kam' },
    year: '2023',
    role: ROLE.stabilization,
    client: 'Commercial',
    image: 'images/projects/alsaa-kam-01.jpg',
  },
  {
    id: 'rouge',
    title: { ar: 'روج', en: 'Rouge' },
    year: '2023',
    role: ROLE.consultant,
    client: 'Commercial',
    image: 'images/projects/rouge-01.jpg',
  },
  {
    id: 'ardh-alamjad',
    title: { ar: 'أرض الأمجاد', en: 'Ardh Al-Amjad' },
    year: '2024',
    role: ROLE.stabilization,
    client: 'Commercial',
    image: 'images/projects/ardh-alamjad-01.jpg',
  },
  {
    id: 'dakar-rally',
    title: { ar: 'رالي داكار', en: 'Dakar Rally' },
    year: '2024',
    role: ROLE.consultant,
    client: 'Commercial',
    image: 'images/projects/dakar-rally-01.jpg',
  },
  {
    id: 'alzarfa',
    title: { ar: 'الزرفة', en: 'Al-Zarfa' },
    year: '2024',
    role: ROLE.stabilization,
    client: 'Commercial',
    image: 'images/projects/alzarfa-01.jpg',
  },
  {
    id: 'mira',
    title: { ar: 'ميرا ميرا ميرا', en: 'Mira Mira Mira' },
    year: '2024',
    role: ROLE.consultant,
    client: 'Commercial',
    image: 'images/projects/mira-mira-mira-01.jpg',
  },
];

export const CLIENTS = [
  { name: 'MBC',                logo: 'images/clients/mbc.png' },
  { name: 'Netflix',            logo: 'images/clients/netflix.png' },
  { name: 'Shahid',             logo: 'images/clients/shahid.png' },
  { name: 'Rotana Media Group', logo: 'images/clients/rotana-media-group.png' },
  { name: 'Riyadh Season',      logo: 'images/clients/riyadh-season.png' },
  { name: 'Pepsi',              logo: 'images/clients/pepsi.png' },
  { name: 'Toyota',             logo: 'images/clients/toyota.png' },
  { name: 'Maserati',           logo: 'images/clients/maserati.png' },
  { name: 'Al Nassr FC',        logo: 'images/clients/al-nassr.png' },
  { name: 'Al Hilal FC',        logo: 'images/clients/alhilal.png' },
];
