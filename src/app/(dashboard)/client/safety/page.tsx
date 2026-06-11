import { redirect } from "next/navigation";

export default function SafetyRedirectPage() {
  redirect("/client/indicators");
}
