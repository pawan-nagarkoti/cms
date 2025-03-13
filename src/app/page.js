import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to another page
  redirect("/dashboard");
  return null;
}
