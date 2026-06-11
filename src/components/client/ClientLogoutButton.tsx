"use client";

import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";

export function ClientLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
      <IconLogout size={16} stroke={1.8} />
      خروج
    </button>
  );
}
