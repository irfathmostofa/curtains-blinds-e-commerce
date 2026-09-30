export type ImageAsset = {
  url: string;
  alt: string;
  thumbnailUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  image_alt: string;
  parent_id: string | null;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size_label: string;
  price: number;
  sku: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  images: ImageAsset[];
  fabric_options: string[];
  is_bestseller: boolean;
  is_active: boolean;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  created_at: string;
  category?: Category;
  variants?: ProductVariant[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  product_interest: string;
  budget_range: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "converted";
  created_at: string;
};

export type ChatMessage = {
  role: "bot" | "user";
  text: string;
};

export type ChatLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  product_interest: string;
  rooms: string;
  location: string;
  estimate_min: number;
  estimate_max: number;
  booking_date: string;
  booking_time: string;
  transcript: ChatMessage[];
  source: string;
  status: "new" | "contacted" | "converted";
  created_at: string;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  preferred_date: string;
  preferred_time_slot: string;
  notes?: string;
  status: "new" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  source: string;
  is_featured: boolean;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  cover_image_alt: string;
  author: string;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string;
  logo_alt: string;
  sort_order: number;
};

export type NavLink = {
  label: string;
  href: string;
};

export type LocationInfo = {
  city: string;
  address: string;
  phone: string;
  mapEmbedUrl: string;
};

export type HomepageFeature = {
  icon: "ruler" | "shield" | "sparkles" | "clock";
  title: string;
  body: string;
};

export type HomepageSectionCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type HowItWorksStep = {
  number: string;
  title: string;
  body: string;
};

export type HeroVariant = "classic" | "carousel";

export type HeroSlide = {
  badge: string;
  title: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  image_url: string;
  image_alt: string;
  express_label: string;
  express_detail: string;
};

export type HomepageSectionId =
  | "hero"
  | "marquee"
  | "intro"
  | "how_it_works"
  | "features"
  | "collections"
  | "filtered_products"
  | "bestsellers"
  | "reviews"
  | "cta"
  | "partners"
  | "faqs"
  | "story";

export type HomepageSectionLayout = {
  id: HomepageSectionId;
  enabled: boolean;
};

export type HomepageContent = {
  hero: HeroSlide & {
    variant: HeroVariant;
    autoplay_ms: number;
  };
  hero_slides: HeroSlide[];
  marquee: string[];
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary_cta_label: string;
    primary_cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
  };
  how_it_works: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: HowItWorksStep[];
  };
  features: HomepageFeature[];
  collections: HomepageSectionCopy;
  filtered_products: HomepageSectionCopy & {
    limit: number;
    show_all_tab: boolean;
    show_bestsellers_tab: boolean;
  };
  bestsellers: HomepageSectionCopy;
  reviews: HomepageSectionCopy;
  cta: {
    title: string;
    subtitle: string;
    button_label: string;
    button_href: string;
  };
  partners: HomepageSectionCopy;
  faqs: HomepageSectionCopy;
  story: {
    title: string;
    paragraphs: string[];
  };
  section_order: HomepageSectionLayout[];
};

export type SiteSettings = {
  nav_links: NavLink[];
  company_name: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  social_links: { label: string; href: string }[];
  business_hours: string;
  locations: LocationInfo[];
  trust: { rating: number; reviews: number; warranty: string };
  seo: {
    default_title: string;
    default_description: string;
    og_image: string;
    keywords: string;
    twitter_handle: string;
    google_site_verification: string;
    bing_site_verification: string;
  };
  gtm_id: string;
  meta_pixel_id: string;
  instagram_pixel_id: string;
  tiktok_pixel_id: string;
  homepage: HomepageContent;
};

export type CmsPage = {
  slug: string;
  title: string;
  content: string;
  seo_title: string;
  seo_description: string;
};

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  keywords?: string | string[];
};

export type AdminRole = "admin" | "editor";
