import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { playStatic, playBootTone, isAudioReady } from "@/lib/audioEngine";


interface Props {
  onDone: () => void;
}

export function Loader({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"line" | "static" | "done">("line");

  useEffect(() => {
    const lineT = setTimeout(() => {
      setStage("static");
      // Only play the boot buzz if the audio context is already running
      // (i.e. the user has interacted with the page before). If it's
      // suspended, skip it — otherwise it would queue up and play late.
      if (isAudioReady()) {
        try {
          playBootTone();
        } catch { /* noop */ }
      }
    }, 700);
    return () => clearTimeout(lineT);
  }, []);

  useEffect(() => {
    if (stage !== "static") return;
    const start = performance.now();
    const duration = 2800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setStage("done");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  useEffect(() => {
    if (stage !== "done") return;
    if (isAudioReady()) {
      try { playStatic(180, 0.5); } catch { /* noop */ }
    }
    const t = setTimeout(onDone, 520);
    return () => clearTimeout(t);
  }, [stage, onDone]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {stage === "line" && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0.9 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          className="w-full bg-white origin-center"
          style={{ height: "2px", boxShadow: "0 0 80px rgba(255,255,255,0.8)" }}
        />
      )}

      {stage === "static" && (
        <>
          <div className="absolute inset-0 static-noise opacity-90" />
          <div className="absolute inset-0 crt-scanlines" />
          <div className="relative z-10 flex flex-col items-center gap-8 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="display-text text-center text-3xl md:text-5xl text-[hsl(var(--crt-amber))] glow-text"
              style={{ textShadow: "0 0 8px hsl(var(--crt-amber)), 0 0 24px hsl(var(--crt-amber)/0.6)" }}
            >
              Loading memories…
            </motion.h1>

            <div className="w-72 md:w-96 mx-auto">
              <div className="border-2 border-[hsl(var(--crt-amber))] p-1 bg-black/60">
                <div className="h-5 relative overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--crt-amber))] transition-none"
                    style={{
                      width: `${progress * 100}%`,
                      boxShadow: "0 0 12px hsl(var(--crt-amber))",
                      backgroundImage:
                        "repeating-linear-gradient(90deg, hsl(var(--crt-amber)) 0 8px, hsl(38 80% 45%) 8px 12px)",
                    }}
                  />
                </div>
              </div>
              <div className="mono-text text-2xl text-[hsl(var(--crt-amber))]/80 text-center mt-3">
                {Math.floor(progress * 100)}%
              </div>
            </div>
          </div>
        </>
      )}

      {stage === "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05 }}
          className="absolute inset-0 bg-white"
        />
      )}
    </div>
  );
}
