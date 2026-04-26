import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Power, Volume2, VolumeX, Dice5, Tv, Wand2, Train, Joystick } from "lucide-react";
import {
  ALL_SHOWS,
  ARCADE_GAMES,
  DIY_SHOWS,
  PRESCHOOL_SHOWS,
  type ChannelId,
} from "@/lib/shows";
import {
  getVolume,
  isMuted,
  playChannelSwitch,
  playClick,
  playPowerOff,
  playPowerOn,
  playShowAudio,
  playStatic,
  setMuted as setEngineMuted,
  setVolume as setEngineVolume,
  stopAll,
  unlockAudio,
} from "@/lib/audioEngine";
import { TvScreen } from "@/components/TvScreen";

const STORAGE_KEY = "fun-factory:state";

interface PersistedState {
  channel: ChannelId | null;
  showId: string | null;
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { channel: null, showId: null };
    return JSON.parse(raw) as PersistedState;
  } catch {
    return { channel: null, showId: null };
  }
}

export function TvShell() {
  const initial = useMemo(loadState, []);
  const [powered, setPowered] = useState(true);
  const [channel, setChannelState] = useState<ChannelId | null>(initial.channel);
  const [showId, setShowIdState] = useState<string | null>(initial.showId);
  const [switching, setSwitching] = useState(false);
  const [extraFlicker, setExtraFlicker] = useState(false);
  const [volume, setVolumeState] = useState(() => getVolume());
  const [muted, setMutedState] = useState(() => isMuted());

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ channel, showId }));
    } catch {
      /* noop */
    }
  }, [channel, showId]);

  const triggerSwitch = (cb: () => void, intense = false) => {
    try {
      unlockAudio();
      playChannelSwitch();
      if (intense) playStatic(450, 0.5);
    } catch {
      /* noop */
    }
    setExtraFlicker(intense);
    setSwitching(true);
    window.setTimeout(() => {
      cb();
      window.setTimeout(() => {
        setSwitching(false);
        setExtraFlicker(false);
      }, 180);
    }, intense ? 520 : 360);
  };

  const handleChannel = (c: ChannelId) => {
    if (!powered) return;
    if (c === channel) return;
    triggerSwitch(() => {
      setChannelState(c);
      setShowIdState(null);
      stopAll();
    });
  };

  const handlePickShow = (id: string) => {
    triggerSwitch(() => {
      setShowIdState(id);
      const show = ALL_SHOWS.find((s) => s.id === id);
      if (show) {
        playShowAudio(show.audio, show.id);
      }
    });
  };

  const handlePickGame = (id: string | null) => {
    triggerSwitch(() => {
      setShowIdState(id);
      stopAll();
    });
  };

  const handleBackToChannel = () => {
    triggerSwitch(() => {
      setShowIdState(null);
      stopAll();
    });
  };

  const handleGotoArcade = () => {
    triggerSwitch(() => {
      setChannelState("arcade");
      setShowIdState(null);
      stopAll();
    }, true);
  };

  const handlePower = () => {
    if (powered) {
      playPowerOff();
      stopAll();
      setPowered(false);
    } else {
      playPowerOn();
      setPowered(true);
    }
  };

  const handleNostalgic = () => {
    if (!powered) return;
    const pool = [...ALL_SHOWS];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    triggerSwitch(() => {
      setChannelState(pick.channel);
      setShowIdState(pick.id);
      playShowAudio(pick.audio, pick.id);
    }, true);
  };

  const handleVolume = (v: number) => {
    setVolumeState(v);
    setEngineVolume(v);
  };

  const handleMute = () => {
    const nm = !muted;
    setMutedState(nm);
    setEngineMuted(nm);
    playClick();
  };

  return (
    <div className="relative min-h-screen w-full px-4 py-8 md:px-8 md:py-12 flex items-center justify-center">
      {/* room ambience */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--crt-amber) / 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-6">
        {/* TV body */}
        <div className="relative w-full max-w-5xl">
          {/* antennas */}
          <div className="absolute left-1/2 -top-20 md:-top-28 -translate-x-1/2 flex gap-16 md:gap-24 pointer-events-none">
            <div
              className="w-1 bg-gradient-to-t from-[hsl(28_30%_30%)] to-[hsl(28_30%_15%)] origin-bottom"
              style={{ height: "100px", transform: "rotate(-22deg)" }}
            />
            <div
              className="w-1 bg-gradient-to-t from-[hsl(28_30%_30%)] to-[hsl(28_30%_15%)] origin-bottom"
              style={{ height: "100px", transform: "rotate(22deg)" }}
            />
          </div>

          <div
            className="plastic-bezel rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6"
            style={{
              border: "2px solid hsl(28 25% 12%)",
            }}
          >
            {/* Screen + frame */}
            <div className="flex flex-col gap-4">
              <div
                className="relative aspect-[4/3] w-full rounded-[1.25rem] md:rounded-[1.75rem] bg-black overflow-hidden crt-flicker"
                style={{
                  border: "10px solid hsl(28 30% 8%)",
                  boxShadow:
                    "inset 0 0 60px rgba(0,0,0,0.85), inset 0 0 18px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.6)",
                }}
              >
                <AnimatePresence>
                  {!powered && (
                    <motion.div
                      key="off"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 bg-black flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                        animate={{ scaleY: 0.02, scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-full bg-[hsl(var(--crt-amber)/0.4)]"
                        style={{ transformOrigin: "center" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {powered && (
                  <>
                    <TvScreen
                      channel={channel}
                      showId={showId}
                      onPickShow={handlePickShow}
                      onBackToChannel={handleBackToChannel}
                      onGotoArcade={handleGotoArcade}
                      onPickGame={handlePickGame}
                    />

                    {switching && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: extraFlicker ? 0.95 : 0.85 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 static-noise"
                      />
                    )}

                    <div className="absolute inset-0 crt-scanlines pointer-events-none" />

                    {/* channel label */}
                    {channel && (
                      <div className="absolute top-3 right-4 z-20 mono-text text-xl text-[hsl(var(--crt-amber))]/90 glow-text">
                        CH {channel === "diy" ? "03" : channel === "preschool" ? "07" : "13"}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* speaker grille below the screen */}
              <div className="flex items-center gap-3 md:gap-5">
                <div className="speaker-grille flex-1 h-12 md:h-16 rounded-md border border-black/40" />
                <div className="display-text text-[hsl(var(--crt-amber))] text-xs md:text-sm tracking-widest whitespace-nowrap glow-text">
                  FUN&nbsp;FACTORY
                </div>
                <div className="speaker-grille flex-1 h-12 md:h-16 rounded-md border border-black/40" />
              </div>
            </div>

            {/* Right control panel */}
            <div className="flex md:flex-col items-center justify-between md:justify-start gap-4 md:gap-5 md:w-44 md:pl-2">
              <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-3 w-full">
                <ChannelButton
                  active={channel === "diy"}
                  onClick={() => handleChannel("diy")}
                  icon={<Wand2 className="size-4" />}
                  label="DIY"
                  testId="button-channel-diy"
                />
                <ChannelButton
                  active={channel === "preschool"}
                  onClick={() => handleChannel("preschool")}
                  icon={<Train className="size-4" />}
                  label="Preschool"
                  testId="button-channel-preschool"
                />
                <ChannelButton
                  active={channel === "arcade"}
                  onClick={() => handleChannel("arcade")}
                  icon={<Joystick className="size-4" />}
                  label="Arcade"
                  testId="button-channel-arcade"
                />
              </div>

              <div className="hidden md:block w-full h-px bg-black/30 my-1" />

              <button
                onClick={handleNostalgic}
                disabled={!powered}
                className="channel-btn w-full rounded-lg px-3 py-2 text-xs md:text-sm display-text uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-40"
                data-testid="button-nostalgic"
              >
                <Dice5 className="size-4" />
                <span className="hidden md:inline">I Feel Nostalgic</span>
                <span className="md:hidden">Random</span>
              </button>

              <div className="flex md:flex-col items-center gap-3 md:gap-4 md:w-full">
                <button
                  onClick={handleMute}
                  className="knob size-12 md:size-14 rounded-full flex items-center justify-center text-[hsl(var(--crt-amber))]"
                  data-testid="button-mute"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </button>

                <div className="flex-1 md:w-full md:px-2">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(e) => handleVolume(Number(e.target.value))}
                    className="w-full accent-[hsl(var(--crt-amber))]"
                    data-testid="input-volume"
                  />
                </div>

                <button
                  onClick={handlePower}
                  className="knob size-14 md:size-16 rounded-full flex items-center justify-center text-[hsl(var(--destructive))]"
                  data-testid="button-power"
                  aria-label="Power"
                >
                  <Power className="size-6" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* TV stand */}
          <div className="mx-auto mt-2 w-3/5 h-6 wood-panel rounded-b-xl shadow-2xl" />
          <div className="mx-auto mt-1 w-4/5 h-2 bg-black/40 rounded-full blur-md" />
        </div>

        {/* Footer hint */}
        <div className="mono-text text-center text-base md:text-lg text-[hsl(var(--muted-foreground))]">
          {powered ? (
            <>
              <Tv className="inline-block size-4 mr-1 -mt-1" />
              {channel
                ? showId
                  ? `Now showing — ${ALL_SHOWS.find((s) => s.id === showId)?.name ?? ARCADE_GAMES.find((g) => g.id === showId)?.name ?? ""}`
                  : `Channel: ${channel === "diy" ? "DIY Shows" : channel === "preschool" ? "Preschool" : "Arcade"} — pick something to watch`
                : `Pick a channel — ${DIY_SHOWS.length + PRESCHOOL_SHOWS.length + ARCADE_GAMES.length} memories waiting`}
            </>
          ) : (
            <>The TV is off. Press the power knob to turn it back on.</>
          )}
        </div>
      </div>
    </div>
  );
}

interface ChannelButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  testId?: string;
}

function ChannelButton({ active, onClick, icon, label, testId }: ChannelButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`channel-btn rounded-lg px-3 py-2 md:py-3 text-xs display-text uppercase tracking-wide flex items-center justify-center gap-2 ${
        active ? "active" : "text-[hsl(var(--foreground))]"
      }`}
      data-testid={testId}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
