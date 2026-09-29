import { entities } from "@/lib/admin/entities";
import {
  getAdminUsers,
  getBlogPosts,
  getBookings,
  getCategories,
  getChatLeads,
  getCmsPages,
  getFaqs,
  getLeads,
  getPartners,
  getProducts,
  getTestimonials,
} from "@/lib/data/catalog";

export async function loadEntityRows(key: string): Promise<Record<string, unknown>[]> {
  const config = entities[key];
  if (!config) return [];
  switch (config.storeKey) {
    case "products":
      return (await getProducts({ includeInactive: true })) as unknown as Record<string, unknown>[];
    case "categories":
      return (await getCategories()) as unknown as Record<string, unknown>[];
    case "leads":
      return (await getLeads()) as unknown as Record<string, unknown>[];
    case "chatLeads":
      return (await getChatLeads()) as unknown as Record<string, unknown>[];
    case "bookings":
      return (await getBookings()) as unknown as Record<string, unknown>[];
    case "testimonials":
      return (await getTestimonials({ includeHidden: true })) as unknown as Record<string, unknown>[];
    case "posts":
      return (await getBlogPosts({ includeDrafts: true })) as unknown as Record<string, unknown>[];
    case "faqs":
      return (await getFaqs()) as unknown as Record<string, unknown>[];
    case "partners":
      return (await getPartners()) as unknown as Record<string, unknown>[];
    case "pages":
      return (await getCmsPages()) as unknown as Record<string, unknown>[];
    case "users":
      return (await getAdminUsers()) as unknown as Record<string, unknown>[];
    default:
      return [];
  }
}
