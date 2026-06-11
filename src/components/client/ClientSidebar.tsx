"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconScale } from "@tabler/icons-react";
import {
  filterClientNav,
  type ClientNavEntry,
  type ClientNavLink,
} from "@/lib/client-nav";
import type { ClientSession } from "@/lib/types";

interface ClientSidebarProps {
  open: boolean;
  onClose: () => void;
  session: ClientSession;
}

function isLinkActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/client") return false;
  return pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, children: ClientNavLink[]) {
  return children.some((child) => isLinkActive(pathname, child.href));
}

export function ClientSidebar({ open, onClose, session }: ClientSidebarProps) {
  const pathname = usePathname();
  const navItems = useMemo(() => filterClientNav(session), [session]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    navItems.forEach((entry) => {
      if (entry.kind === "group" && isGroupActive(pathname, entry.children)) {
        setOpenGroups((prev) => ({ ...prev, [entry.id]: true }));
      }
    });
  }, [pathname, navItems]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function isGroupOpen(id: string, children: ClientNavLink[]) {
    if (openGroups[id] !== undefined) return openGroups[id];
    return isGroupActive(pathname, children);
  }

  let lastSection = "";

  function renderLink(item: ClientNavLink, subItem = false) {
    const active = isLinkActive(pathname, item.href);
    return (
      <Link
        href={item.href}
        className={`sb-item${subItem ? " sb-subitem" : ""}${active ? " active" : ""}`}
        onClick={onClose}
      >
        <item.icon size={subItem ? 16 : 18} stroke={1.8} />
        {item.label}
      </Link>
    );
  }

  function renderEntry(entry: ClientNavEntry) {
    const section = entry.section ?? "";
    const showSection =
      entry.kind === "link" && section && section !== lastSection;
    if (showSection) lastSection = section;

    if (entry.kind === "link") {
      return (
        <span key={entry.href}>
          {showSection ? <div className="sb-section">{section}</div> : null}
          {renderLink(entry)}
        </span>
      );
    }

    const expanded = isGroupOpen(entry.id, entry.children);
    const groupActive = isGroupActive(pathname, entry.children);

    return (
      <span key={entry.id}>
        <button
          type="button"
          className={`sb-item sb-group${groupActive ? " active" : ""}${expanded ? " expanded" : ""}`}
          onClick={() => toggleGroup(entry.id)}
          aria-expanded={expanded}
        >
          <entry.icon size={18} stroke={1.8} />
          <span style={{ flex: 1 }}>{entry.label}</span>
          <IconChevronDown size={16} stroke={1.8} className="sb-chevron" />
        </button>
        {expanded ? (
          <div className="sb-submenu">
            {entry.children.map((child) => (
              <span key={child.href}>{renderLink(child, true)}</span>
            ))}
          </div>
        ) : null}
      </span>
    );
  }

  return (
    <aside id="sidebar" className={open ? "open" : undefined}>
      <div className="sb-logo">
        <div className="sb-logo-mark">
          <IconScale size={22} stroke={1.8} />
        </div>
        <h1>ركاز</h1>
        <p>نظام المحاسبة غير الربحية</p>
      </div>

      <nav className="sb-nav">{navItems.map((entry) => renderEntry(entry))}</nav>

      <div className="sb-footer">ركاز © 2025 — القطاع غير الربحي</div>
    </aside>
  );
}
