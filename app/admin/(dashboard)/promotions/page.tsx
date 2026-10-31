import { requireAdminPage } from "@/lib/admin/guard";
import { getUniquePromoContacts } from "@/lib/data/catalog";
import { PromotionForm } from "./promotion-form";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  await requireAdminPage("/admin/promotions");
  const contacts = await getUniquePromoContacts();
  return <PromotionForm contacts={contacts} />;
}
