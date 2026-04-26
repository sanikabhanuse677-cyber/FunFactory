import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { ARCADE_GAMES } from "@/lib/shows";
import { Snake } from "@/components/games/Snake";
import { CityBloxx } from "@/components/games/CityBloxx";
import { BlockPuzzle } from "@/components/games/BlockPuzzle";

interface Props {
  gameId: string | null;
  onPickGame: (id: string | null) => void;
  onBack: () => void;
}

type SubView = "menu" | "play" | "rules";

export function ArcadeChannel({ gameId, onPickGame, onBack }: Props) {
  const [view, setView] = useState<SubView>("menu");

  useEffect(() => {
    setView("menu");
  }, [gameId]);

  const game = ARCADE_GAMES.find((g) => g.id === gameId);

  return (
    <div className="absolute inset-0 nokia-screen p-3 md:p-5 flex flex-col">
      {/* Nokia top bar */}
      <div className="flex items-center justify-between border-b-2 border-[hsl(110_30%_12%)] pb-1 mb-2">
        <span className="pixel-text text-[10px] md:text-xs">NOKIA 3310</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block w-1 md:w-1.5 h-2 md:h-2.5 bg-[hsl(110_30%_12%)]"
              style={{ opacity: 0.4 + i * 0.15 }}
            />
          ))}
        </div>
      </div>

      {!gameId && <ArcadeMenu onPickGame={onPickGame} onBack={onBack} />}

      {gameId && (
        <div className="flex-1 flex flex-col min-h-0 relative">
          {view === "menu" && (
            <GameMenu
              title={game?.name ?? "GAME"}
              onPlay={() => setView("play")}
              onRules={() => setView("rules")}
              onBack={() => onPickGame(null)}
            />
          )}
          {view === "play" && (
            <div className="flex-1 min-h-0 flex flex-col">
              <button
                onClick={() => setView("menu")}
                className="pixel-text text-[10px] md:text-xs flex items-center gap-1 mb-2"
                data-testid="button-back-game"
              >
                <ArrowLeft className="size-3" /> menu
              </button>
              <div className="flex-1 min-h-0">
                {gameId === "snake" && <Snake />}
                {gameId === "city-bloxx" && <CityBloxx />}
                {gameId === "block-puzzle" && <BlockPuzzle />}
              </div>
            </div>
          )}
          {view === "rules" && (
            <Rules name={game?.name ?? ""} gameId={gameId} onBack={() => setView("menu")} />
          )}
        </div>
      )}
    </div>
  );
}

function ArcadeMenu({
  onPickGame,
  onBack,
}: {
  onPickGame: (id: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const items = [...ARCADE_GAMES, { id: "_back", name: "Back" }];
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="pixel-text text-xs md:text-sm text-center mb-3 mt-1">— GAMES —</div>
      <div className="flex-1 overflow-y-auto">
        {items.map((g, i) => (
          <motion.button
            key={g.id}
            onMouseEnter={() => setSelected(i)}
            onClick={() => {
              if (g.id === "_back") onBack();
              else onPickGame(g.id);
            }}
            className={`w-full text-left pixel-text text-[11px] md:text-sm px-2 py-2 flex items-center justify-between border-b border-[hsl(110_30%_12%)]/40 ${
              selected === i ? "bg-[hsl(110_30%_12%)] text-[hsl(88_60%_55%)]" : ""
            }`}
            data-testid={`button-game-${g.id}`}
          >
            <span>
              {i + 1}. {g.name}
            </span>
            <ChevronRight className="size-3" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function GameMenu({
  title,
  onPlay,
  onRules,
  onBack,
}: {
  title: string;
  onPlay: () => void;
  onRules: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
      <div className="pixel-text text-sm md:text-lg">{title}</div>
      <div className="w-full max-w-[180px] flex flex-col gap-1">
        <button
          onClick={onPlay}
          className="pixel-text text-[11px] md:text-sm py-2 border-2 border-[hsl(110_30%_12%)] hover:bg-[hsl(110_30%_12%)] hover:text-[hsl(88_60%_55%)]"
          data-testid="button-play"
        >
          PLAY
        </button>
        <button
          onClick={onRules}
          className="pixel-text text-[11px] md:text-sm py-2 border-2 border-[hsl(110_30%_12%)] hover:bg-[hsl(110_30%_12%)] hover:text-[hsl(88_60%_55%)]"
          data-testid="button-rules"
        >
          RULES
        </button>
        <button
          onClick={onBack}
          className="pixel-text text-[11px] md:text-sm py-2 border-2 border-[hsl(110_30%_12%)] hover:bg-[hsl(110_30%_12%)] hover:text-[hsl(88_60%_55%)]"
          data-testid="button-back"
        >
          BACK
        </button>
      </div>
    </div>
  );
}

function Rules({ name, gameId, onBack }: { name: string; gameId: string; onBack: () => void }) {
  const text =
    gameId === "snake"
      ? "Use ARROW KEYS or WASD to steer the snake. Eat pellets to grow. Don't hit walls or yourself."
      : gameId === "city-bloxx"
      ? "Press SPACE or click DROP to land each block. Stack accurately — overhang gets cut off. How tall can you build?"
      : gameId === "block-puzzle"
      ? "Tap a shape from the tray, then tap a square on the 8x8 grid to place it. Fill a row or column to clear it. Game ends when no shape fits."
      : "A demo of this classic.";
  return (
    <div className="flex-1 flex flex-col p-1 text-center justify-between">
      <div>
        <div className="pixel-text text-xs md:text-sm mb-2">RULES — {name}</div>
        <div className="pixel-text text-[10px] md:text-xs leading-relaxed text-left max-w-xs mx-auto">
          {text}
        </div>
      </div>
      <button
        onClick={onBack}
        className="pixel-text text-[11px] md:text-sm py-1 border-2 border-[hsl(110_30%_12%)] mt-2"
      >
        BACK
      </button>
    </div>
  );
}
