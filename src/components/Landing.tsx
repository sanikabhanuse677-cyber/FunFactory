import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { playClick, playPowerOn, playBootTone, unlockAudio } from "@/lib/audioEngine";

interface Props {
  onStart: () => void;
}

export function Landing({ onStart }: Props) {
  const handleStart = () => {
    try {
      unlockAudio();
      playClick();
      playPowerOn();
      playBootTone();
    } catch {
      /* ignored */
    }
    setTimeout(onStart, 320);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-hidden">
      {/* warm vignette */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="pixel-text text-[hsl(var(--crt-amber))] text-xs md:text-sm tracking-widest">
            CHANNEL 1989
          </span>
          <h1
            className="display-text text-[hsl(var(--crt-amber))] leading-[0.95] text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              textShadow:
                "0 0 6px hsl(var(--crt-amber)), 0 0 30px hsl(var(--crt-amber)/0.45), 4px 4px 0 hsl(16 70% 35%), 8px 8px 0 hsl(0 0% 0% / 0.5)",
            }}
          >
            FUN FACTORY
          </h1>
          <p className="mono-text text-2xl md:text-3xl text-[hsl(var(--foreground))]/80 max-w-xl">
            Relive the magic of your childhood
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[hsl(var(--crt-amber))] text-[hsl(28_50%_12%)] display-text text-xl md:text-2xl shadow-[0_10px_0_hsl(38_80%_30%),0_18px_40px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-[0_4px_0_hsl(38_80%_30%),0_8px_20px_rgba(0,0,0,0.5)] transition-transform"
          data-testid="button-press-start"
        >
          <Power className="size-6" strokeWidth={3} />
          PRESS START
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mono-text text-base text-[hsl(var(--muted-foreground))] mt-4"
        >
          a love letter to saturday morning television
        </motion.div>
      </div>

      {/* subtle floating dust */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[hsl(var(--crt-amber))]/60"
            style={{ left: `${(i * 73) % 100}%`, top: `${(i * 41) % 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
