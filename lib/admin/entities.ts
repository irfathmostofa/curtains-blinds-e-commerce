export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "image"
  | "json"
  | "date";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  hint?: string;
};

export type EntityConfig = {
  key: string;
  title: string;
  description: string;
  href: string;
  storeKey: "products" | "categories" | "leads" | "bookings" | "testimonials" | "posts" | "faqs" | "partners" | "users";
  columns: { key: string; label: string }[];
  fields: FieldConfig[];
  creatable?: boolean;
  statusField?: string;
};

export const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/users", label: "Users" },
];

export const entities: Record<string, EntityConfig> = {
  products: {
    key: "products",
    title: "Products",
    description: "Catalogue, pricing, images and SEO fields.",
    href: "/admin/products",
    storeKey: "products",
    creatable: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "base_price", label: "From (AED)" },
      { key: "is_bestseller", label: "Bestseller" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "category_id", label: "Category ID", type: "text", required: true },
      { name: "base_price", label: "Base price (AED)", type: "number", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "seo_title", label: "SEO title", type: "text" },
      { name: "seo_description", label: "SEO description", type: "textarea" },
      { name: "is_bestseller", label: "Bestseller", type: "checkbox" },
      { name: "is_active", label: "Active", type: "checkbox" },
      { name: "fabric_options", label: "Fabric options (JSON array)", type: "json" },
      { name: "images", label: "Images JSON [{url, alt}]", type: "json" },
    ],
  },
  categories: {
    key: "categories",
    title: "Categories",
    description: "Nested collections and SEO.",
    href: "/admin/categories",
    storeKey: "categories",
    creatable: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "parent_id", label: "Parent ID", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "image_alt", label: "Image alt text", type: "text", required: true },
      { name: "seo_title", label: "SEO title", type: "text" },
      { name: "seo_description", label: "SEO description", type: "textarea" },
    ],
  },
  leads: {
    key: "leads",
    title: "Leads",
    description: "Estimate inbox.",
    href: "/admin/leads",
    storeKey: "leads",
    statusField: "status",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "product_interest", label: "Interest" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "status", label: "Status", type: "select", options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Converted", value: "converted" },
      ] },
    ],
  },
  bookings: {
    key: "bookings",
    title: "Bookings",
    description: "Visit diary.",
    href: "/admin/bookings",
    storeKey: "bookings",
    statusField: "status",
    columns: [
      { key: "name", label: "Name" },
      { key: "location", label: "Location" },
      { key: "preferred_date", label: "Date" },
      { key: "preferred_time_slot", label: "Slot" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: [
        { label: "New", value: "new" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ] },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    description: "Reviews shown on the homepage.",
    href: "/admin/testimonials",
    storeKey: "testimonials",
    creatable: true,
    columns: [
      { key: "customer_name", label: "Name" },
      { key: "rating", label: "Rating" },
      { key: "is_featured", label: "Featured" },
    ],
    fields: [
      { name: "customer_name", label: "Customer name", type: "text", required: true },
      { name: "rating", label: "Rating", type: "number", required: true },
      { name: "review_text", label: "Review", type: "textarea", required: true },
      { name: "source", label: "Source", type: "text" },
      { name: "is_featured", label: "Featured", type: "checkbox" },
    ],
  },
  posts: {
    key: "posts",
    title: "Blog",
    description: "SEO articles.",
    href: "/admin/blog",
    storeKey: "posts",
    creatable: true,
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "published_at", label: "Published" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "HTML content", type: "textarea", hint: "HTML is rendered on the public article page." },
      { name: "cover_image_alt", label: "Cover image alt", type: "text", required: true },
      { name: "author", label: "Author", type: "text" },
      { name: "published_at", label: "Published at", type: "date" },
      { name: "seo_title", label: "SEO title", type: "text" },
      { name: "seo_description", label: "SEO description", type: "textarea" },
    ],
  },
  faqs: {
    key: "faqs",
    title: "FAQs",
    description: "Crawlable Q&A.",
    href: "/admin/faqs",
    storeKey: "faqs",
    creatable: true,
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  partners: {
    key: "partners",
    title: "Partners",
    description: "Logo strip.",
    href: "/admin/partners",
    storeKey: "partners",
    creatable: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo_alt", label: "Logo alt text", type: "text", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  users: {
    key: "users",
    title: "Users",
    description: "Admin accounts.",
    href: "/admin/users",
    storeKey: "users",
    creatable: true,
    columns: [
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { name: "email", label: "Email", type: "text", required: true },
      { name: "role", label: "Role", type: "select", options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ] },
    ],
  },
};
