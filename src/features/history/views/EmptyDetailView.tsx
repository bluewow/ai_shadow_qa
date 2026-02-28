import { FileSearch } from "lucide-react";

export function EmptyDetailView() {
  return (
    <div className="w-[55%] flex items-center justify-center">
      <div className="text-center space-y-3">
        <FileSearch className="w-10 h-10 text-slate-600 mx-auto" />
        <p className="text-sm text-slate-500">세션을 선택하세요</p>
      </div>
    </div>
  );
}
