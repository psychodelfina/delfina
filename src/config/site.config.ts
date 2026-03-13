// Site configuration file
// All content data in one place

export interface SEOConfig {
  // Basic meta
  title: string;
  description: string;
  keywords: string[];
  author: string;
  
  // Site info
  siteUrl: string;
  siteName: string;
  locale: string;
  
  // Open Graph
  ogType: 'website' | 'article' | 'profile';
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  
  // Twitter Cards
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  
  // Robots
  robots: {
    index: boolean;
    follow: boolean;
    googleBot?: string;
  };
  
  // Structured Data (LocalBusiness)
  structuredData: {
    type: string;
    name: string;
    description: string;
    image: string;
    address: {
      streetAddress?: string;
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
    telephone?: string;
    email?: string;
    priceRange: string;
    openingHours?: string[];
    sameAs: string[];
  };
  
  // Additional meta
  themeColor: string;
  canonicalUrl?: string;
}

export interface SiteConfig {
  seo: SEOConfig;
  hero: {
    name: string;
    tagline: string;
    location: string;
    description: string;
    image: string;
    telegramUrl: string;
    telegramChannel: string;
    bookingOpen: boolean;
  };
  contacts: {
    telegram: string;
    instagram: string;
    vk: string;
    tiktok: string;
  };
  portfolio: {
    src: string;
    alt: string;
  }[];
  certificates: {
    src: string;
    alt: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const siteConfig: SiteConfig = {
  seo: {
    // Basic meta
    title: 'PSYCHODELFINA | Тату мастер СПб — Психоделические татуировки',
    description: 'Тату мастер в Санкт-Петербурге. Яркие психоделические татуировки в стиле kawaii, anime и авторский стиль. Запись через Telegram. Портфолио и сертификаты.',
    keywords: [
      'тату мастер',
      'тату спб',
      'татуировки санкт-петербург',
      'тату kawaii',
      'тату аниме',
      'психоделические тату',
      'цветные татуировки',
      'тату студия спб',
      'авторские татуировки',
      'тату мастер петербург',
      'psychodelfina',
      'яркие татуировки',
      'тату anime style',
      'женский тату мастер',
    ],
    author: 'Psychodelfina',
    
    // Site info
    siteUrl: 'https://psychodelfina.ru',
    siteName: 'PSYCHODELFINA',
    locale: 'ru_RU',
    
    // Open Graph
    ogType: 'website',
    ogImage: '/og-image.jpg',
    ogImageAlt: 'Psychodelfina — тату мастер в Санкт-Петербурге',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    
    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterSite: '@psychodelfina',
    twitterCreator: '@psychodelfina',
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
    },
    
    // Structured Data (LocalBusiness)
    structuredData: {
      type: 'TattooParlor',
      name: 'PSYCHODELFINA — Тату мастер',
      description: 'Профессиональный тату мастер в Санкт-Петербурге. Специализация: яркие психоделические татуировки в стиле kawaii, anime и авторские работы.',
      image: 'https://psychodelfina.ru/content/my-selfie.jpg',
      address: {
        addressLocality: 'Санкт-Петербург',
        addressRegion: 'Санкт-Петербург',
        addressCountry: 'RU',
      },
      geo: {
        latitude: 59.9343,
        longitude: 30.3351,
      },
      priceRange: '₽₽',
      sameAs: [
        'https://t.me/psychodelfina',
        'https://instagram.com/psychodelfina',
        'https://vk.com/psychodelfina',
        'https://tiktok.com/@psychodelfina',
      ],
    },
    
    // Additional meta
    themeColor: '#0a0612',
  },

  hero: {
    name: 'PSYCHODELFINA',
    tagline: 'Твой тату мастер',
    location: 'Санкт-Петербург',
    description: `✨ меня зовут Дельфина, др 21.11.1997, сейчас мне 27. Живу и работаю в Санкт-Петербурге с 2018 года, татуировкой занимаюсь с 2017 года. А так до этого родилась и жила в Петропавловске (Казахстан) и пару лет в Астане. Работаю в тату-студии INK ME. Люблю семью, друзей, Максимулика, своих крысок, сны, рисовать, Шрека, короков из Зельды, энимал кроссинг, хэллоу китти айсленд эдвенче, колу без сахара, историю игрушек, молочные чаи, сырный чай, скорпионов, убираться, сериалы и фильмы про семью или ужасы, триллеры, игру жуконямки, ездить на природу, группу аффинаж и 4позиции бруно, исполнителя стромае, книгу дом в котором, сериал это мы и фильм капитан фантастик, чипсы лейс с сыром, фиолетовый цвет ближе к синему, туман, все времена года, день ног, мистику и игрушки`,
    image: '/content/my-selfie.jpg',
    telegramUrl: 'https://t.me/psychodelfina1',
    telegramChannel: 'Telegram канал',
    bookingOpen: true,
  },

  contacts: {
    telegram: 'https://t.me/psychodelfina',
    instagram: 'https://instagram.com/psychodelfina',
    vk: 'https://vk.com/psychodelfina',
    tiktok: 'https://tiktok.com/@psychodelfina',
  },

  portfolio: [
    { src: '/content/portfolio/photo_2025-05-15_12-50-44.jpg', alt: 'Тату аниме девушка с яркими цветами' },
    { src: '/content/portfolio/photo_2025-05-15_12-50-48.jpg', alt: 'Тату красочный лист с звездами' },
    { src: '/content/portfolio/photo_2025-05-15_12-50-51.jpg', alt: 'Тату сердце в стиле граффити' },
    { src: '/content/portfolio/photo_2025-05-15_12-50-52.jpg', alt: 'Тату на спине в фиолетовых тонах' },
    { src: '/content/portfolio/photo_2025-05-15_12-50-54.jpg', alt: 'Тату аниме персонаж с яркими цветами' },
    { src: '/content/portfolio/photo_2025-07-24_14-43-03.jpg', alt: 'Тату карта Таро с единорогом' },
  ],

  certificates: [
    { src: '/content/certificates/photo_1_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
    { src: '/content/certificates/photo_2_2026-01-19_16-38-23.jpg', alt: 'Сертификат на тату' },
    { src: '/content/certificates/photo_3_2026-01-19_16-38-23.jpg', alt: 'Подарочный сертификат' },
    { src: '/content/certificates/photo_4_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
    { src: '/content/certificates/photo_5_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
    { src: '/content/certificates/photo_6_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
    { src: '/content/certificates/photo_7_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
    { src: '/content/certificates/photo_8_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
    { src: '/content/certificates/photo_9_2026-01-19_16-38-23.jpg', alt: 'Тату сертификат' },
  ],

  faq: [
    {
      question: 'Сколько стоит татуировка?',
      answer: 'Стоимость зависит от размера, сложности и места нанесения. Минимальная стоимость работы от 5000₽. Для точного расчёта отправьте идею в Telegram — отвечу в течение дня!',
    },
    {
      question: 'Как записаться на сеанс?',
      answer: 'Напишите мне в Telegram с описанием идеи, желаемым размером и местом нанесения. Мы обсудим детали, я сделаю эскиз и согласуем дату сеанса.',
    },
    {
      question: 'Как подготовиться к сеансу?',
      answer: 'Выспитесь, поешьте перед сеансом, не употребляйте алкоголь за сутки. Наденьте удобную одежду с доступом к месту нанесения тату.',
    },
    {
      question: 'Больно ли делать тату?',
      answer: 'Ощущения индивидуальны и зависят от места нанесения. Большинство клиентов описывают это как терпимый дискомфорт. Делаем перерывы по необходимости!',
    },
    {
      question: 'Сколько длится сеанс?',
      answer: 'Небольшие работы занимают 1-3 часа. Крупные проекты могут потребовать несколько сеансов. Точное время обсуждаем после согласования эскиза.',
    },
    {
      question: 'Можно ли принести свой эскиз?',
      answer: 'Конечно! Приносите референсы и идеи — я адаптирую их в своём авторском стиле или воплощу вашу идею максимально близко к оригиналу.',
    },
  ],
};

// Helper function to generate JSON-LD for LocalBusiness
export function generateStructuredData(config: SiteConfig): object {
  const { seo, faq } = config;
  const sd = seo.structuredData;
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // LocalBusiness / TattooParlor
      {
        '@type': sd.type,
        '@id': `${seo.siteUrl}/#business`,
        name: sd.name,
        description: sd.description,
        image: sd.image,
        url: seo.siteUrl,
        address: {
          '@type': 'PostalAddress',
          ...sd.address,
        },
        ...(sd.geo && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: sd.geo.latitude,
            longitude: sd.geo.longitude,
          },
        }),
        priceRange: sd.priceRange,
        sameAs: sd.sameAs,
      },
      // WebSite
      {
        '@type': 'WebSite',
        '@id': `${seo.siteUrl}/#website`,
        url: seo.siteUrl,
        name: seo.siteName,
        description: seo.description,
        inLanguage: 'ru-RU',
      },
      // WebPage
      {
        '@type': 'WebPage',
        '@id': `${seo.siteUrl}/#webpage`,
        url: seo.siteUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': `${seo.siteUrl}/#website` },
        about: { '@id': `${seo.siteUrl}/#business` },
        inLanguage: 'ru-RU',
      },
      // FAQPage
      {
        '@type': 'FAQPage',
        '@id': `${seo.siteUrl}/#faq`,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}
