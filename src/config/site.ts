// Site configuration
export const SITE = {
  title: 'Lantar Cipta Media',
  description: 'KONSULTAN TEKNOLOGI, INFORMASI DAN JASA, KONSULTASI LAINNYA',
  url: 'https://lantarciptamedia.co.id/#',
  author: 'Lantar Cipta Media',
} as const;

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/capabilities' },
  { name: 'Portofolio', href: '/use-cases' },
  // { name: 'Services', href: '/facilities' },
  { name: 'Career', href: '/rfq' },
  { name: 'Documentation', href: '/documentation' },
] as const;

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/yourcompany',
  twitter: 'https://twitter.com/yourcompany',
  facebook: 'https://facebook.com/yourcompany',
} as const;

