import { redirect } from "next/navigation";

export default function AdminPage() {
  // We can redirect the user to the first actual admin section
  // Or we could build a proper dashboard with stats here
  redirect("/admin/themes");
}
