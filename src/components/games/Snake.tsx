import { useEffect, useRef, useState, useCallback } from "react";
import { playGameOver, playPickup } from "@/lib/audioEngine";

const COLS = 20;
const ROWS = 15;
const CELL = 14;
const TICK_MS = 130;

type Cell = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

function randCell(occupied: Cell[]): Cell {
  while (true) {
    const c = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!occupied.some((o) => o.x === c.x && o.y === c.y)) return c;
  }
}

export function Snake() {
  const initial: Cell[] = [
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 },
  ];
  const [snake, setSnake] = useState<Cell[]>(initial);
  const [dir, setDir] = useState<Dir>("right");
  const [pendingDir, setPendingDir] = useState<Dir>("right");
  const [food, setFood] = useState<Cell>({ x: 12, y: 7 });
  const [score, setScore] = useState(0);
  const [alive, setAlive] = useState(true);
  const [paused, setPaused] = useState(false);
  const tickRef = useRef<number | null>(null);
  const high = useRef<number>(Number(localStorage.getItem("ff:snake:high") ?? 0));

  const reset = useCallback(() => {
    setSnake(initial);
    setDir("right");
    setPendingDir("right");
    setFood({ x: 12, y: 7 });
    setScore(0);
    setAlive(true);
    setPaused(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") setPendingDir((d) => (d === "down" ? d : "up"));
      else if (k === "arrowdown" || k === "s") setPendingDir((d) => (d === "up" ? d : "down"));
      else if (k === "arrowleft" || k === "a") setPendingDir((d) => (d === "right" ? d : "left"));
      else if (k === "arrowright" || k === "d") setPendingDir((d) => (d === "left" ? d : "right"));
      else if (k === " " || k === "p") {
        if (!alive) reset();
        else setPaused((p) => !p);
      }
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [alive, reset]);

  useEffect(() => {
    if (!alive || paused) return;
    tickRef.current = window.setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const d = pendingDir;
        setDir(d);
        const dx = d === "left" ? -1 : d === "right" ? 1 : 0;
        const dy = d === "up" ? -1 : d === "down" ? 1 : 0;
        const next = { x: head.x + dx, y: head.y + dy };

        if (
          next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS ||
          prev.some((c, i) => i !== prev.length - 1 && c.x === next.x && c.y === next.y)
        ) {
          setAlive(false);
          playGameOver();
          if (score > high.current) {
            high.current = score;
            try { localStorage.setItem("ff:snake:high", String(score)); } catch { /* noop */ }
          }
          return prev;
        }

        const ate = next.x === food.x && next.y === food.y;
        const newSnake = [next, ...prev];
        if (!ate) newSnake.pop();
        else {
          playPickup();
          setScore((s) => s + 10);
          setFood(randCell(newSnake));
        }
        return newSnake;
      });
    }, TICK_MS);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [alive, paused, pendingDir, food.x, food.y, score]);

  const w = COLS * CELL;
  const h = ROWS * CELL;

  return (
    <div className="flex-1 flex flex-col items-center min-h-0 select-none">
      <div className="w-full flex items-center justify-between pixel-text text-[10px] md:text-xs px-1 mb-1">
        <span>SCORE {score}</span>
        <span>HIGH {high.current}</span>
      </div>
      <div
        className="border-2 border-[hsl(110_30%_12%)] relative"
        style={{ width: w, height: h, background: "hsl(88 60% 55%)" }}
      >
        {/* food */}
        <div
          className="absolute"
          style={{
            left: food.x * CELL,
            top: food.y * CELL,
            width: CELL,
            height: CELL,
            background: "hsl(110 30% 12%)",
            boxShadow: "inset 0 0 0 2px hsl(88 60% 55%)",
          }}
        />
        {/* snake */}
        {snake.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: c.x * CELL,
              top: c.y * CELL,
              width: CELL,
              height: CELL,
              background: "hsl(110 30% 12%)",
              border: "1px solid hsl(88 60% 55%)",
            }}
          />
        ))}
        {(!alive || paused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[hsl(88_60%_55%)]/80">
            <div className="text-center">
              <div className="pixel-text text-xs md:text-sm">{alive ? "PAUSED" : "GAME OVER"}</div>
              <div className="pixel-text text-[10px] md:text-xs mt-2">
                {alive ? "press SPACE" : "press SPACE to restart"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-2">
        <div></div>
        <button
          className="pixel-text text-xs border-2 border-[hsl(110_30%_12%)] py-1"
          onClick={() => setPendingDir((d) => (d === "down" ? d : "up"))}
        >▲</button>
        <div></div>
        <button
          className="pixel-text text-xs border-2 border-[hsl(110_30%_12%)] py-1"
          onClick={() => setPendingDir((d) => (d === "right" ? d : "left"))}
        >◀</button>
        <button
          className="pixel-text text-[10px] border-2 border-[hsl(110_30%_12%)] py-1"
          onClick={() => { if (!alive) reset(); else setPaused((p) => !p); }}
        >{alive ? (paused ? "PLAY" : "II") : "↻"}</button>
        <button
          className="pixel-text text-xs border-2 border-[hsl(110_30%_12%)] py-1"
          onClick={() => setPendingDir((d) => (d === "left" ? d : "right"))}
        >▶</button>
        <div></div>
        <button
          className="pixel-text text-xs border-2 border-[hsl(110_30%_12%)] py-1"
          onClick={() => setPendingDir((d) => (d === "up" ? d : "down"))}
        >▼</button>
        <div></div>
      </div>
      <div className="mt-1 pixel-text text-[9px] md:text-[10px] text-center opacity-70">
        arrows or WASD · space to pause
      </div>
    </div>
  );
}
