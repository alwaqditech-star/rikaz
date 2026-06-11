"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconDashboard,
  IconDots,
  IconPencil,
} from "@tabler/icons-react";
import type { ClientPermissions } from "@/lib/client-permissions";
import type { ClientSession } from "@/lib/types";
import { ClientPermissionsProvider } from "./ClientPermissionsContext";
import { ClientSidebar } from "./ClientSidebar";
import { ClientTopbar } from "./ClientTopbar";

interface ClientLayoutShellProps {
  session: ClientSession;
  permissions: ClientPermissions;
  children: React.ReactNode;
}

const MOBILE_NAV = [
  { href: "/client", label: "الرئيسية", icon: IconDashboard, access: "read" as const },
  { href: "/client/vouchers/receipts", label: "القبض", icon: IconArrowDownCircle, access: "write" as const },
  { href: "/client/vouchers/payments", label: "الصرف", icon: IconArrowUpCircle, access: "write" as const },
  { href: "/client/je", label: "القيد", icon: IconPencil, access: "write" as const },
];

export function ClientLayoutShell({ session, permissions, children }: ClientLayoutShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isFirstLogin = pathname.startsWith("/client/first-login");

  const mobileNav = MOBILE_NAV.filter((item) => {
    if (item.access === "write") return permissions.canWrite;
    return permissions.canRead;
  });

  if (isFirstLogin) {
    return <>{children}</>;
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <ClientPermissionsProvider permissions={permissions}>
      <ClientSidebar open={sidebarOpen} onClose={closeSidebar} session={session} />
      <div
        id="sidebar-overlay"
        className={sidebarOpen ? "open" : undefined}
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === "Escape" && closeSidebar()}
        role="presentation"
      />
      <main id="main">
        <ClientTopbar session={session} onMenuClick={() => setSidebarOpen(true)} />
        <div id="content">{children}</div>
      </main>
      <nav id="mobile-nav">
        {mobileNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/client" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : undefined}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                fontFamily: "var(--font)",
                fontSize: 10,
                fontWeight: 600,
                color: active ? "var(--teal)" : "var(--mist)",
                padding: "6px 4px",
                textDecoration: "none",
              }}
            >
              <item.icon size={20} stroke={1.8} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            fontFamily: "var(--font)",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--mist)",
            padding: "6px 4px",
          }}
        >
          <IconDots size={20} stroke={1.8} />
          المزيد
        </button>
      </nav>
    </ClientPermissionsProvider>
  );
}
