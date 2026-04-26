import { motion } from "framer-motion";
import type { ChannelId } from "@/lib/shows";
import { HomeChannel } from "@/components/channels/HomeChannel";
import { DiyChannel } from "@/components/channels/DiyChannel";
import { PreschoolChannel } from "@/components/channels/PreschoolChannel";
import { ArcadeChannel } from "@/components/channels/ArcadeChannel";

interface Props {
  channel: ChannelId | null;
  showId: string | null;
  onPickShow: (id: string) => void;
  onBackToChannel: () => void;
  onGotoArcade: () => void;
  onPickGame: (id: string | null) => void;
}

export function TvScreen({
  channel,
  showId,
  onPickShow,
  onBackToChannel,
  onGotoArcade,
  onPickGame,
}: Props) {
  return (
    <motion.div
      key={`${channel ?? "home"}-${showId ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-10"
    >
      {channel === null && <HomeChannel />}
      {channel === "diy" && (
        <DiyChannel
          showId={showId}
          onPickShow={onPickShow}
          onBack={onBackToChannel}
          onGotoArcade={onGotoArcade}
        />
      )}
      {channel === "preschool" && (
        <PreschoolChannel
          showId={showId}
          onPickShow={onPickShow}
          onBack={onBackToChannel}
          onGotoArcade={onGotoArcade}
        />
      )}
      {channel === "arcade" && (
        <ArcadeChannel gameId={showId} onPickGame={onPickGame} onBack={onBackToChannel} />
      )}
    </motion.div>
  );
}
