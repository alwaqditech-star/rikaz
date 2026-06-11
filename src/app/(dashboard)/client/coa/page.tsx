import { IconListTree } from "@tabler/icons-react";
import { CoaTreeView } from "@/components/client/CoaTreeView";

export default function CoaPage() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <IconListTree size={18} stroke={1.8} />
          الدليل المحاسبي — شجرة الحسابات
        </div>
      </div>
      <CoaTreeView />
    </div>
  );
}
