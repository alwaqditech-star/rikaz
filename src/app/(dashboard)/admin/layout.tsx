import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { IconBuildingCommunity, IconChartBar } from "@tabler/icons-react";
import { AdminUserLink } from "@/components/admin/AdminUserLink";
import { getSessionFromCookie } from "@/lib/auth";
import { query } from "@/lib/db";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    redirect("/");
  }

  let avatarUrl: string | null = session.avatar_url ?? null;
  try {
    const rows = await query<RowDataPacket[]>(
      "SELECT avatar_url FROM admins WHERE id = ?",
      [session.id],
    );
    avatarUrl = (rows[0]?.avatar_url as string | null) ?? null;
  } catch {
    // ignore if column not migrated yet
  }

  return (
    <>
      <aside id="sidebar">
        <div className="sb-logo">
          <div className="sb-logo-mark">
            <IconBuildingCommunity size={22} stroke={1.8} />
          </div>
          <h1>ركاز</h1>
          <p>لوحة مدير النظام</p>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">الإدارة</div>
          <AdminNav />
        </nav>

        <div className="sb-footer">
          <AdminLogoutButton />
        </div>
      </aside>

      <main id="main">
        <header id="topbar">
          <div className="tb-title">
            <IconChartBar size={20} stroke={1.8} />
            <span>ركاز — إدارة المشتركين</span>
          </div>
          <div className="tb-actions">
            <AdminUserLink
              name={session.name}
              username={session.username}
              avatarUrl={avatarUrl}
            />
          </div>
        </header>
        <div id="content">{children}</div>
      </main>
    </>
  );
}
