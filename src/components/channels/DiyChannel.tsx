import { motion } from "framer-motion";
import { DIY_SHOWS } from "@/lib/shows";
import { ShowDetail } from "@/components/ShowDetail";

interface Props {
  showId: string | null;
  onPickShow: (id: string) => void;
  onBack: () => void;
  onGotoArcade: () => void;
}

export function DiyChannel({ showId, onPickShow, onBack, onGotoArcade }: Props) {
  if (showId) {
    const show = DIY_SHOWS.find((s) => s.id === showId);
    if (!show) return null;
    return <ShowDetail show={show} onBack={onBack} onGotoArcade={onGotoArcade} />;
  }

  return (
    <div
      className="absolute inset-0 overflow-y-auto p-4 md:p-6"
      style={{
        background:
          "linear-gradient(180deg, hsl(16 75% 30%) 0%, hsl(28 60% 18%) 100%)",
      }}
    >
      <div className="display-text text-xl md:text-3xl text-[hsl(45_95%_70%)] glow-text mb-1">
        DIY CHANNEL
      </div>
      <div className="mono-text text-base md:text-lg text-[hsl(45_95%_92%)]/80 mb-4">
        Pick a show. Make a mess. Wash your hands after.
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {DIY_SHOWS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPickShow(s.id)}
            className="relative rounded-md p-3 md:p-4 text-left text-[hsl(28_50%_15%)] shadow-[0_4px_0_hsl(38_80%_30%),0_8px_18px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_2px_0_hsl(38_80%_30%)] overflow-hidden"
            style={{
              background: "hsl(45 95% 60%)",
            }}
            data-testid={`button-show-${s.id}`}
          >
            <div className="display-text text-base md:text-xl leading-tight" style={{ textShadow: "2px 2px 0 rgba(255,255,255,0.4)" }}>
              {s.name}
            </div>
            <div className="mono-text text-sm md:text-base mt-1 line-clamp-2 opacity-80">{s.blurb}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
