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

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  preferred_date: string;
  preferred_time_slot: string;
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

export type HomepageContent = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primary_cta_label: string;
    primary_cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
  };
  features: HomepageFeature[];
  collections: HomepageSectionCopy;
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
  };
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
};

export type AdminRole = "admin" | "editor";
