import { redirect } from "next/navigation";

export default function NewEntityRedirect({ params }: { params: { entity: string } }) {
  redirect(`/admin/${params.entity}`);
}
