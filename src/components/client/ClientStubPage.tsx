import type { TablerIcon } from "@tabler/icons-react";

interface ClientStubPageProps {
  title: string;
  description: string;
  icon: TablerIcon;
}

export function ClientStubPage({ title, description, icon: Icon }: ClientStubPageProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Icon size={18} stroke={1.8} />
          {title}
        </div>
      </div>
      <div className="tbl-empty">
        <Icon size={36} stroke={1.2} style={{ opacity: 0.4, margin: "0 auto 8px" }} />
        {description}
      </div>
    </div>
  );
}
