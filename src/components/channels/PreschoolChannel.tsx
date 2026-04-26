import { motion } from "framer-motion";
import { PRESCHOOL_SHOWS } from "@/lib/shows";
import { ShowDetail } from "@/components/ShowDetail";

interface Props {
  showId: string | null;
  onPickShow: (id: string) => void;
  onBack: () => void;
  onGotoArcade: () => void;
}

export function PreschoolChannel({ showId, onPickShow, onBack, onGotoArcade }: Props) {
  if (showId) {
    const show = PRESCHOOL_SHOWS.find((s) => s.id === showId);
    if (!show) return null;
    return <ShowDetail show={show} onBack={onBack} onGotoArcade={onGotoArcade} />;
  }

  return (
    <div
      className="absolute inset-0 overflow-y-auto p-4 md:p-6"
      style={{
        background:
          "linear-gradient(180deg, hsl(265 50% 30%) 0%, hsl(195 60% 20%) 100%)",
      }}
    >
      <div className="display-text text-xl md:text-3xl text-[hsl(45_95%_70%)] glow-text mb-1">
        PRESCHOOL
      </div>
      <div className="mono-text text-base md:text-lg text-white/85 mb-4">
        The shows that raised a generation.
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {PRESCHOOL_SHOWS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, rotate: (i % 2 === 0 ? -1 : 1) * 1.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPickShow(s.id)}
            className="relative aspect-[4/3] rounded-md p-2 md:p-3 text-left overflow-hidden border-2 border-black/30 shadow-[0_3px_0_rgba(0,0,0,0.4),0_8px_18px_rgba(0,0,0,0.45)]"
            style={{ background: s.bg, color: s.fg }}
            data-testid={`button-show-${s.id}`}
          >
            <div className="display-text text-sm md:text-base leading-tight" style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}>
              {s.name}
            </div>
            <div className="absolute bottom-2 right-2 mono-text text-xs opacity-80">▶</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
