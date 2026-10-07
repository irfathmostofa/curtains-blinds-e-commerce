import { adminNav } from "@/lib/admin/entities";

export type AdminRole = "superadmin" | "admin" | "editor";

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

export const ROLE_OPTIONS: { label: string; value: AdminRole }[] = [
  { label: "Super admin", value: "superadmin" },
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
];

const ADMIN_PATHS = [
  "/admin/products",
  "/admin/categories",
  "/admin/leads",
  "/admin/chat-leads",
  "/admin/bookings",
  "/admin/testimonials",
  "/admin/blog",
  "/admin/faqs",
  "/admin/partners",
] as const;

const EDITOR_PATHS = ["/admin/products", "/admin/categories", "/admin/blog"] as const;

const ADMIN_ENTITIES = new Set([
  "products",
  "categories",
  "leads",
  "chatLeads",
  "bookings",
  "testimonials",
  "posts",
  "faqs",
  "partners",
]);

const EDITOR_ENTITIES = new Set(["products", "categories", "posts"]);

const PATH_ENTITY: Record<string, string> = {
  "/admin/products": "products",
  "/admin/categories": "categories",
  "/admin/leads": "leads",
  "/admin/chat-leads": "chatLeads",
  "/admin/bookings": "bookings",
  "/admin/testimonials": "testimonials",
  "/admin/blog": "posts",
  "/admin/faqs": "faqs",
  "/admin/partners": "partners",
  "/admin/pages": "pages",
  "/admin/users": "users",
  "/admin/settings": "settings",
  "/admin/homepage": "homepage",
  "/admin/about": "about",
};

export function normalizeRole(value: unknown): AdminRole {
  const role = String(value || "").trim().toLowerCase();
  if (role === "superadmin" || role === "super_admin" || role === "super-admin") return "superadmin";
  if (role === "editor") return "editor";
  if (role === "admin") return "admin";
  return "editor";
}

function pathAllowed(allowed: readonly string[], pathname: string) {
  return allowed.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function canAccessPath(role: AdminRole, pathname: string) {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";
  if (path === "/admin" || path === "/admin/login") return true;
  if (role === "superadmin") return true;
  if (role === "admin") return pathAllowed(ADMIN_PATHS, path);
  return pathAllowed(EDITOR_PATHS, path);
}

export function canWriteEntity(role: AdminRole, entity: string) {
  if (role === "superadmin") return true;
  if (role === "admin") return ADMIN_ENTITIES.has(entity);
  return EDITOR_ENTITIES.has(entity);
}

export function entityFromPath(pathname: string) {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";
  if (PATH_ENTITY[path]) return PATH_ENTITY[path];
  const match = Object.keys(PATH_ENTITY).find((key) => path.startsWith(`${key}/`));
  return match ? PATH_ENTITY[match] : "";
}

export function navForRole(role: AdminRole) {
  return adminNav.filter((item) => canAccessPath(role, item.href));
}
