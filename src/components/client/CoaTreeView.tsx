"use client";

import { useMemo, useState } from "react";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";
import { COA } from "@/lib/coa-data";

const groupColors: Record<string, string> = {
  "1": "#1B2A4A",
  "2": "#2C4A7C",
  "3": "#c9973a",
  "4": "#b03050",
};

type CoaAccount = { code: string; name: string };
type CoaSubNode = {
  code: string;
  name: string;
  subs?: CoaSubNode[];
  accs?: CoaAccount[];
};
type CoaGroup = { code: string; name: string; subs: CoaSubNode[] };

function matchesSearch(text: string, query: string) {
  return text.toLowerCase().includes(query) || text.includes(query);
}

function filterSubNode(node: CoaSubNode, query: string): CoaSubNode | null {
  if (node.subs?.length) {
    const subs = node.subs
      .map((child) => filterSubNode(child, query))
      .filter((child): child is CoaSubNode => child !== null);
    if (subs.length) return { ...node, subs };
  }

  if (node.accs?.length) {
    const accs = node.accs.filter(
      (acc) => matchesSearch(acc.name, query) || acc.code.includes(query),
    );
    if (accs.length) return { ...node, accs };
  }

  if (matchesSearch(node.name, query) || node.code.includes(query)) {
    return node;
  }

  return null;
}

function filterCoaGroups(query: string): CoaGroup[] {
  if (!query) return COA as unknown as CoaGroup[];

  return (COA as unknown as CoaGroup[])
    .map((group) => {
      const subs = group.subs
        .map((sub) => filterSubNode(sub, query))
        .filter((sub): sub is CoaSubNode => sub !== null);
      return subs.length ? { ...group, subs } : null;
    })
    .filter((group): group is CoaGroup => group !== null);
}

export function CoaTreeView() {
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCoa = useMemo(
    () => filterCoaGroups(normalizedSearch),
    [normalizedSearch],
  );

  function toggle(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function isOpen(id: string) {
    return normalizedSearch ? true : !!openGroups[id];
  }

  return (
    <>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث في الحسابات..."
          style={{
            padding: "7px 12px",
            border: "1.5px solid var(--silver)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font)",
            fontSize: 13,
            width: 200,
          }}
        />
      </div>
      <div id="coa-tree">
        {filteredCoa.map((group) => (
          <div className="coa-group" key={group.code}>
            <div
              className={`coa-group-head${isOpen(`g${group.code}`) ? " open" : ""}`}
              onClick={() => toggle(`g${group.code}`)}
              onKeyDown={(e) => e.key === "Enter" && toggle(`g${group.code}`)}
              role="button"
              tabIndex={0}
            >
              <div className="coa-head-left">
                <span
                  className="coa-code-badge"
                  style={{ background: groupColors[group.code] || "var(--teal)" }}
                >
                  {group.code}
                </span>
                <span className="coa-group-title">{group.name}</span>
              </div>
              <IconChevronDown
                size={14}
                className={`coa-chevron${isOpen(`g${group.code}`) ? " open" : ""}`}
              />
            </div>
            {isOpen(`g${group.code}`) ? (
              <div className="coa-group-body open">
                {group.subs.map((sub) => (
                  <div className="coa-sub-group" key={sub.code} style={{ margin: "8px 12px" }}>
                    <div
                      className="coa-sub-head"
                      onClick={() => toggle(`s${sub.code}`)}
                      onKeyDown={(e) => e.key === "Enter" && toggle(`s${sub.code}`)}
                      role="button"
                      tabIndex={0}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="coa-sub-title">{sub.name}</span>
                        <span className="coa-sub-code">{sub.code}</span>
                      </div>
                      <IconChevronLeft size={12} className="coa-chevron" />
                    </div>
                    {sub.subs
                      ? sub.subs.map((ss) => (
                          <div
                            key={ss.code}
                            style={{
                              margin: "4px 12px 4px 0",
                              border: "1px solid var(--fog)",
                              borderRadius: 6,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "7px 12px",
                                background: "var(--snow)",
                                cursor: "pointer",
                                fontSize: 12.5,
                                fontWeight: 600,
                                color: "var(--slate)",
                              }}
                              onClick={() => toggle(`ss${ss.code}`)}
                              onKeyDown={(e) => e.key === "Enter" && toggle(`ss${ss.code}`)}
                              role="button"
                              tabIndex={0}
                            >
                              <span>
                                {ss.name}{" "}
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    fontSize: 11,
                                    color: "var(--mist)",
                                    marginRight: 6,
                                  }}
                                >
                                  {ss.code}
                                </span>
                              </span>
                              <IconChevronLeft size={11} className="coa-chevron" />
                            </div>
                            {isOpen(`ss${ss.code}`) && ss.accs ? (
                              <div className="coa-accounts open">
                                {ss.accs.map((acc) => (
                                  <div className="coa-acc-row" key={acc.code}>
                                    <span>{acc.name}</span>
                                    <span className="coa-acc-code">{acc.code}</span>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))
                      : null}
                    {sub.accs && isOpen(`s${sub.code}`) ? (
                      <div className="coa-accounts open">
                        {sub.accs.map((acc) => (
                          <div className="coa-acc-row" key={acc.code}>
                            <span>{acc.name}</span>
                            <span className="coa-acc-code">{acc.code}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
