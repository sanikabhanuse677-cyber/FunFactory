import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Heart, Lightbulb, Music, Joystick, Hammer } from "lucide-react";
import type { Show } from "@/lib/shows";
import { playClick, playShowAudio } from "@/lib/audioEngine";

interface Props {
  show: Show;
  onBack: () => void;
  onGotoArcade: () => void;
}

type Reveal = "memory" | "fact" | null;

const FLOAT_COUNT = 8;

export function ShowDetail({ show, onBack, onGotoArcade }: Props) {
  const [reveal, setReveal] = useState<Reveal>(null);

  const floats = useMemo(
    () =>
      Array.from({ length: FLOAT_COUNT }, (_, i) => ({
        left: ((i * 73 + 11) % 100),
        top: ((i * 41 + 23) % 100),
        delay: (i % 5) * 0.4,
        duration: 5 + (i % 3),
        size: 6 + (i % 3) * 4,
      })),
    [],
  );

  // animate gradient
  useEffect(() => {
    return () => {
      // nothing
    };
  }, [show.id]);

  const playTheme = () => {
    playClick();
    playShowAudio(show.audio, show.id);
  };

  const handleReveal = (which: Reveal) => {
    playClick();
    setReveal((cur) => (cur === which ? null : which));
  };

  const isDiy = show.channel === "diy";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 overflow-hidden"
      style={{ color: show.fg }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: show.bg,
          backgroundSize: "220% 220%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floats.map((f, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              background: show.accent,
              opacity: 0.35,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.2, 0.55, 0.2],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto p-3 md:p-5">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="mono-text text-base md:text-lg flex items-center gap-1 hover:underline mb-2"
          data-testid="button-back-channel"
        >
          <ArrowLeft className="size-4" /> back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="display-text text-2xl md:text-5xl leading-tight"
          style={{
            textShadow: `4px 4px 0 rgba(0,0,0,0.45), 0 0 18px ${show.accent}`,
          }}
        >
          {show.name}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mono-text text-base md:text-xl mt-2 max-w-md"
          style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}
        >
          {show.blurb}
        </motion.div>

        {/* DIY Steps */}
        {isDiy && show.steps && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-3 rounded-lg bg-black/30 backdrop-blur-sm border-2 p-3"
            style={{
              borderColor: `${show.accent}55`,
              boxShadow: `0 6px 0 rgba(0,0,0,0.25)`,
            }}
          >
            <div
              className="flex items-center gap-2 display-text text-sm md:text-base mb-1"
              style={{ color: show.accent }}
            >
              <Hammer className="size-4" /> TODAY'S CRAFT
            </div>
            <ol className="mono-text text-base md:text-lg space-y-1 list-decimal list-inside">
              {show.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          <ActionButton onClick={playTheme} accent={show.accent} testId="button-play-theme">
            <Music className="size-4" /> Play Theme
          </ActionButton>
          <ActionButton
            onClick={() => handleReveal("memory")}
            accent={show.accent}
            active={reveal === "memory"}
            testId="button-unlock-memory"
          >
            <Heart className="size-4" /> Unlock Memory
          </ActionButton>
          <ActionButton
            onClick={() => handleReveal("fact")}
            accent={show.accent}
            active={reveal === "fact"}
            testId="button-fun-fact"
          >
            <Lightbulb className="size-4" /> Fun Fact
          </ActionButton>
          <ActionButton onClick={() => { playClick(); onGotoArcade(); }} accent={show.accent} testId="button-play-games">
            <Joystick className="size-4" /> Play Games
          </ActionButton>
        </motion.div>

        {/* Reveal panels */}
        <AnimatePresence mode="wait">
          {reveal && (
            <motion.div
              key={reveal}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="mt-3 p-3 rounded-lg backdrop-blur-sm border-2"
              style={{
                background: "rgba(0,0,0,0.4)",
                borderColor: show.accent,
                boxShadow: `0 0 24px ${show.accent}66, 0 6px 0 rgba(0,0,0,0.3)`,
              }}
            >
              <div
                className="display-text text-sm md:text-base mb-1 flex items-center gap-2"
                style={{ color: show.accent }}
              >
                {reveal === "memory" ? <Heart className="size-4" /> : <Lightbulb className="size-4" />}
                {reveal === "memory" ? "MEMORY UNLOCKED" : "FUN FACT"}
              </div>
              <div className="mono-text text-base md:text-xl leading-snug">
                {reveal === "memory" ? show.memory : show.funFact}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  accent: string;
  active?: boolean;
  testId?: string;
}

function ActionButton({ children, onClick, accent, active, testId }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      onClick={onClick}
      className="mono-text text-base md:text-lg px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 border-2 transition-shadow"
      style={{
        background: active ? accent : "rgba(0,0,0,0.35)",
        color: active ? "#000" : "inherit",
        borderColor: accent,
        boxShadow: active
          ? `0 0 18px ${accent}99, 0 4px 0 rgba(0,0,0,0.35)`
          : `0 4px 0 rgba(0,0,0,0.4)`,
      }}
      data-testid={testId}
    >
      {children}
    </motion.button>
  );
}
