"use client";

import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      className="sb-item"
      onClick={handleLogout}
      style={{ width: "100%", marginTop: 4 }}
    >
      <IconLogout size={18} stroke={1.8} />
      تسجيل الخروج
    </button>
  );
}
