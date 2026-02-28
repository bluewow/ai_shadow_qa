import { FileText } from "lucide-react";

export function ReportEmptyView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3">
      <FileText className="w-8 h-8 text-slate-600" />
      <p className="text-sm text-slate-500">
        아직 리포트가 없습니다
      </p>
      <p className="text-xs text-slate-600">
        화면을 캡처한 후 ANALYZE ERROR 버튼을 클릭하면
        AI가 분석한 리포트가 여기에 표시됩니다.
      </p>
    </div>
  );
}
