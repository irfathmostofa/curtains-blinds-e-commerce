import { redirect } from "next/navigation";

export default function EditEntityRedirect({ params }: { params: { entity: string } }) {
  redirect(`/admin/${params.entity}`);
}
