import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "@/components/Loader";
import { Landing } from "@/components/Landing";
import { TvShell } from "@/components/TvShell";
import { unlockAudio } from "@/lib/audioEngine";

type Phase = "boot" | "landing" | "tv";

function App() {
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen w-full"
          >
            <Loader onDone={() => setPhase("landing")} />
          </motion.div>
        )}
        {phase === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen w-full"
          >
            <Landing onStart={() => setPhase("tv")} />
          </motion.div>
        )}
        {phase === "tv" && (
          <motion.div
            key="tv"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen w-full"
          >
            <TvShell />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
