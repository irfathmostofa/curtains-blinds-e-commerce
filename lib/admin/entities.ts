export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "checkbox"
  | "select"
  | "image"
  | "json"
  | "tags"
  | "slug"
  | "date"
  | "email"
  | "tel";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  hint?: string;
  group?: "content" | "seo" | "media" | "variants";
};

export type EntityConfig = {
  key: string;
  title: string;
  description: string;
  href: string;
  storeKey:
    | "products"
    | "categories"
    | "leads"
    | "chatLeads"
    | "bookings"
    | "testimonials"
    | "posts"
    | "faqs"
    | "partners"
    | "pages"
    | "users";
  table: string;
  columns: { key: string; label: string }[];
  fields: FieldConfig[];
  creatable?: boolean;
  statusField?: string;
  idField?: "id" | "slug";
};

export const adminNav = [
  { href: "/admin", label: "Dashboard", group: "Overview" },
  { href: "/admin/homepage", label: "Homepage", group: "Content" },
  { href: "/admin/products", label: "Products", group: "Catalogue" },
  { href: "/admin/categories", label: "Categories", group: "Catalogue" },
  { href: "/admin/leads", label: "Leads", group: "Inbox" },
  { href: "/admin/chat-leads", label: "Chat leads", group: "Inbox" },
  { href: "/admin/bookings", label: "Bookings", group: "Inbox" },
  { href: "/admin/testimonials", label: "Testimonials", group: "Content" },
  { href: "/admin/blog", label: "Blog", group: "Content" },
  { href: "/admin/faqs", label: "FAQs", group: "Content" },
  { href: "/admin/partners", label: "Partners", group: "Content" },
  { href: "/admin/pages", label: "Pages", group: "Content" },
  { href: "/admin/settings", label: "Site settings", group: "System" },
  { href: "/admin/users", label: "Users", group: "System" },
] as const;

export const slugMap: Record<string, string> = {
  products: "products",
  categories: "categories",
  leads: "leads",
  "chat-leads": "chatLeads",
  bookings: "bookings",
  testimonials: "testimonials",
  blog: "posts",
  faqs: "faqs",
  partners: "partners",
  pages: "pages",
  users: "users",
};

const leadStatus = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Converted", value: "converted" },
];

const bookingStatus = [
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const entities: Record<string, EntityConfig> = {
  products: {
    key: "products",
    title: "Products",
    description: "Catalogue, pricing, images, variants and SEO fields.",
    href: "/admin/products",
    storeKey: "products",
    table: "products",
    creatable: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "base_price", label: "From (AED)" },
      { key: "is_bestseller", label: "Bestseller" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, group: "content" },
      { name: "slug", label: "Slug", type: "slug", required: true, group: "content", hint: "URL path. Auto-fills from the name." },
      { name: "category_id", label: "Category", type: "select", required: true, group: "content" },
      { name: "base_price", label: "Base price (AED)", type: "number", required: true, group: "content" },
      { name: "description", label: "Description", type: "richtext", group: "content" },
      { name: "is_bestseller", label: "Bestseller", type: "checkbox", group: "content" },
      { name: "is_active", label: "Active", type: "checkbox", group: "content" },
      { name: "fabric_options", label: "Fabric options", type: "tags", group: "content", hint: "Tap a suggestion or type a custom fabric and press Enter." },
      { name: "seo_title", label: "Meta title", type: "text", group: "seo", hint: "Shown in search results and browser tabs." },
      { name: "seo_description", label: "Meta description", type: "textarea", group: "seo", hint: "Aim for 140–160 characters." },
      { name: "seo_keywords", label: "Keywords", type: "textarea", group: "seo", hint: "Comma-separated. Example: blackout curtains Dubai, linen drapes Palm Jumeirah." },
    ],
  },
  categories: {
    key: "categories",
    title: "Categories",
    description: "Nested collections and SEO.",
    href: "/admin/categories",
    storeKey: "categories",
    table: "categories",
    creatable: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, group: "content" },
      { name: "slug", label: "Slug", type: "slug", required: true, group: "content", hint: "URL path. Auto-fills from the name." },
      { name: "description", label: "Description", type: "richtext", group: "content" },
      { name: "parent_id", label: "Parent category", type: "select", group: "content" },
      { name: "sort_order", label: "Sort order", type: "number", group: "content" },
      { name: "image_alt", label: "Image alt text", type: "text", required: true, group: "media" },
      { name: "seo_title", label: "Meta title", type: "text", group: "seo" },
      { name: "seo_description", label: "Meta description", type: "textarea", group: "seo" },
      { name: "seo_keywords", label: "Keywords", type: "textarea", group: "seo", hint: "Comma-separated search terms for this collection." },
    ],
  },
  leads: {
    key: "leads",
    title: "Leads",
    description: "Estimate inbox.",
    href: "/admin/leads",
    storeKey: "leads",
    table: "leads",
    creatable: true,
    statusField: "status",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "product_interest", label: "Interest" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "product_interest", label: "Interest", type: "text" },
      { name: "budget_range", label: "Budget range", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "source", label: "Source", type: "text" },
      { name: "status", label: "Status", type: "select", options: leadStatus },
    ],
  },
  chatLeads: {
    key: "chatLeads",
    title: "Chat leads",
    description: "AI chatbot conversations, estimates and booking requests.",
    href: "/admin/chat-leads",
    storeKey: "chatLeads",
    table: "chat_leads",
    statusField: "status",
    columns: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "product_interest", label: "Interest" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "email", label: "Email", type: "email" },
      { name: "product_interest", label: "Interest", type: "text" },
      { name: "rooms", label: "Rooms", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "estimate_min", label: "Estimate min (AED)", type: "number" },
      { name: "estimate_max", label: "Estimate max (AED)", type: "number" },
      { name: "booking_date", label: "Booking date", type: "date" },
      { name: "booking_time", label: "Booking time", type: "text" },
      { name: "status", label: "Status", type: "select", options: leadStatus },
    ],
  },
  bookings: {
    key: "bookings",
    title: "Bookings",
    description: "Visit diary.",
    href: "/admin/bookings",
    storeKey: "bookings",
    table: "bookings",
    creatable: true,
    statusField: "status",
    columns: [
      { key: "name", label: "Name" },
      { key: "location", label: "Location" },
      { key: "preferred_date", label: "Date" },
      { key: "preferred_time_slot", label: "Slot" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "location", label: "Location", type: "select", required: true, options: [
        { label: "Dubai", value: "Dubai" },
        { label: "Abu Dhabi", value: "Abu Dhabi" },
      ] },
      { name: "address", label: "Address", type: "textarea", required: true },
      { name: "preferred_date", label: "Preferred date", type: "date", required: true },
      { name: "preferred_time_slot", label: "Time slot", type: "text", required: true },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: bookingStatus },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    description: "Reviews shown on the homepage.",
    href: "/admin/testimonials",
    storeKey: "testimonials",
    table: "testimonials",
    creatable: true,
    columns: [
      { key: "customer_name", label: "Name" },
      { key: "rating", label: "Rating" },
      { key: "is_featured", label: "Featured" },
    ],
    fields: [
      { name: "customer_name", label: "Customer name", type: "text", required: true },
      { name: "rating", label: "Rating", type: "number", required: true, hint: "1 to 5." },
      { name: "review_text", label: "Review", type: "richtext", required: true },
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
    table: "blog_posts",
    creatable: true,
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "published_at", label: "Published" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, group: "content" },
      { name: "slug", label: "Slug", type: "slug", required: true, group: "content", hint: "URL path. Auto-fills from the title." },
      { name: "excerpt", label: "Excerpt", type: "textarea", group: "content" },
      { name: "content", label: "Content", type: "richtext", group: "content" },
      { name: "cover_image_alt", label: "Cover image alt", type: "text", required: true, group: "media" },
      { name: "author", label: "Author", type: "text", group: "content" },
      { name: "published_at", label: "Published at", type: "date", group: "content" },
      { name: "seo_title", label: "Meta title", type: "text", group: "seo" },
      { name: "seo_description", label: "Meta description", type: "textarea", group: "seo" },
      { name: "seo_keywords", label: "Keywords", type: "textarea", group: "seo", hint: "Comma-separated search terms for this article." },
    ],
  },
  faqs: {
    key: "faqs",
    title: "FAQs",
    description: "Crawlable Q&A.",
    href: "/admin/faqs",
    storeKey: "faqs",
    table: "faqs",
    creatable: true,
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "richtext", required: true },
      { name: "category", label: "Category", type: "select", options: [
        { label: "General", value: "general" },
        { label: "Products", value: "products" },
        { label: "Orders", value: "orders" },
        { label: "Motorized", value: "motorized" },
        { label: "Visits", value: "visits" },
        { label: "Trade", value: "trade" },
      ] },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  partners: {
    key: "partners",
    title: "Partners",
    description: "Logo strip.",
    href: "/admin/partners",
    storeKey: "partners",
    table: "partners",
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
  pages: {
    key: "pages",
    title: "Pages",
    description: "CMS pages such as privacy and terms.",
    href: "/admin/pages",
    storeKey: "pages",
    table: "cms_pages",
    creatable: true,
    idField: "slug",
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, group: "content" },
      { name: "slug", label: "Slug", type: "slug", required: true, group: "content" },
      { name: "content", label: "Content", type: "richtext", group: "content" },
      { name: "seo_title", label: "Meta title", type: "text", group: "seo" },
      { name: "seo_description", label: "Meta description", type: "textarea", group: "seo" },
    ],
  },
  users: {
    key: "users",
    title: "Users",
    description: "Admin accounts.",
    href: "/admin/users",
    storeKey: "users",
    table: "admin_users",
    creatable: true,
    columns: [
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { name: "id", label: "Auth user ID", type: "text", required: true, hint: "Must match an existing Auth user UUID." },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Role", type: "select", options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ] },
    ],
  },
};

export function entityAllowedColumns(key: string): string[] {
  const columns: Record<string, string[]> = {
    products: [
      "id",
      "category_id",
      "name",
      "slug",
      "description",
      "base_price",
      "images",
      "fabric_options",
      "is_bestseller",
      "is_active",
      "seo_title",
      "seo_description",
      "seo_keywords",
    ],
    categories: [
      "id",
      "name",
      "slug",
      "description",
      "image_url",
      "image_alt",
      "parent_id",
      "sort_order",
      "seo_title",
      "seo_description",
      "seo_keywords",
    ],
    leads: [
      "id",
      "name",
      "phone",
      "email",
      "product_interest",
      "budget_range",
      "message",
      "source",
      "status",
    ],
    chatLeads: [
      "id",
      "name",
      "phone",
      "email",
      "product_interest",
      "rooms",
      "location",
      "estimate_min",
      "estimate_max",
      "booking_date",
      "booking_time",
      "transcript",
      "source",
      "status",
    ],
    bookings: [
      "id",
      "name",
      "phone",
      "email",
      "location",
      "address",
      "preferred_date",
      "preferred_time_slot",
      "notes",
      "status",
    ],
    testimonials: ["id", "customer_name", "rating", "review_text", "source", "is_featured"],
    posts: [
      "id",
      "title",
      "slug",
      "excerpt",
      "content",
      "cover_image_url",
      "cover_image_alt",
      "author",
      "published_at",
      "seo_title",
      "seo_description",
      "seo_keywords",
    ],
    faqs: ["id", "question", "answer", "category", "sort_order"],
    partners: ["id", "name", "logo_url", "logo_alt", "sort_order"],
    pages: ["slug", "title", "content", "seo_title", "seo_description"],
    users: ["id", "email", "role"],
  };
  return columns[key] || [];
}
