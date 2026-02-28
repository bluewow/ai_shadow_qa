export interface VideoFeedViewProps {
  isRecording: boolean;
  fps: number;
  latency: number;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function VideoFeedView({
  isRecording,
  fps,
  latency,
  videoRef,
}: VideoFeedViewProps) {
  return (
    <div className="p-4 pb-2">
      <div className="relative aspect-video bg-slate-800 rounded-lg border border-[var(--color-glass-border)] overflow-hidden group">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        />
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-500 text-xs">
              화면 공유를 시작하세요
            </span>
          </div>
        )}
        <div className="scan-line pointer-events-none opacity-40" />
        {isRecording && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/60 rounded-md backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 pulse-rec" />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">
              REC
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-black/60 px-2 py-1 rounded border border-white/10">
          FPS: {fps} &bull; LATENCY: {latency}ms
        </div>
      </div>
    </div>
  );
}
