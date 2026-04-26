import { useCallback, useEffect, useRef, useState } from "react";
import { playGameOver, playPickup } from "@/lib/audioEngine";

const W = 220;
const H = 240;
const FLOOR = H - 10;
const BLOCK_H = 14;

interface Block {
  x: number;
  width: number;
  y: number; // top
}

export function CityBloxx() {
  const [stack, setStack] = useState<Block[]>([
    { x: W / 2 - 60, width: 120, y: FLOOR - BLOCK_H },
  ]);
  const [moving, setMoving] = useState<Block>({ x: 0, width: 120, y: FLOOR - BLOCK_H * 2 });
  const [score, setScore] = useState(0);
  const [alive, setAlive] = useState(true);
  const dirRef = useRef(1);
  const speedRef = useRef(2.2);
  const high = useRef<number>(Number(localStorage.getItem("ff:bloxx:high") ?? 0));
  const movingRef = useRef(moving);
  movingRef.current = moving;

  const reset = useCallback(() => {
    setStack([{ x: W / 2 - 60, width: 120, y: FLOOR - BLOCK_H }]);
    setMoving({ x: 0, width: 120, y: FLOOR - BLOCK_H * 2 });
    dirRef.current = 1;
    speedRef.current = 2.2;
    setScore(0);
    setAlive(true);
  }, []);

  useEffect(() => {
    if (!alive) return;
    let raf = 0;
    const step = () => {
      setMoving((m) => {
        let nx = m.x + dirRef.current * speedRef.current;
        if (nx + m.width > W) {
          nx = W - m.width;
          dirRef.current = -1;
        } else if (nx < 0) {
          nx = 0;
          dirRef.current = 1;
        }
        return { ...m, x: nx };
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [alive]);

  const drop = useCallback(() => {
    if (!alive) return;
    const top = stack[stack.length - 1];
    const m = movingRef.current;
    const left = Math.max(top.x, m.x);
    const right = Math.min(top.x + top.width, m.x + m.width);
    const overlap = right - left;
    if (overlap <= 0) {
      setAlive(false);
      playGameOver();
      if (score > high.current) {
        high.current = score;
        try { localStorage.setItem("ff:bloxx:high", String(score)); } catch { /* noop */ }
      }
      return;
    }
    const placed: Block = { x: left, width: overlap, y: m.y };
    playPickup();
    setStack((s) => [...s, placed]);
    setScore((s) => s + Math.round(overlap));

    const nextWidth = overlap;
    const nextY = placed.y - BLOCK_H;
    speedRef.current = Math.min(5.5, speedRef.current + 0.18);
    setMoving({ x: 0, width: nextWidth, y: nextY });

    // If stack is taller than playfield, scroll perception by trimming oldest
    if (nextY < 30) {
      setStack((s) => s.slice(1).map((b) => ({ ...b, y: b.y + BLOCK_H })));
      setMoving((m) => ({ ...m, y: m.y + BLOCK_H }));
    }
  }, [alive, stack, score]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!alive) reset();
        else drop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [alive, drop, reset]);

  return (
    <div className="flex-1 flex flex-col items-center min-h-0 select-none">
      <div className="w-full flex items-center justify-between pixel-text text-[10px] md:text-xs px-1 mb-1">
        <span>SCORE {score}</span>
        <span>HIGH {high.current}</span>
      </div>
      <div
        className="border-2 border-[hsl(110_30%_12%)] relative"
        style={{ width: W, height: H, background: "hsl(88 60% 55%)" }}
        onClick={() => (alive ? drop() : reset())}
      >
        {/* ground */}
        <div
          className="absolute left-0 right-0"
          style={{ top: FLOOR, height: 10, background: "hsl(110 30% 12%)" }}
        />
        {stack.map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: b.x,
              top: b.y,
              width: b.width,
              height: BLOCK_H,
              background: "hsl(110 30% 12%)",
              border: "1px solid hsl(88 60% 55%)",
            }}
          />
        ))}
        {alive && (
          <div
            className="absolute"
            style={{
              left: moving.x,
              top: moving.y,
              width: moving.width,
              height: BLOCK_H,
              background: "hsl(110 30% 12%)",
              border: "1px solid hsl(88 60% 55%)",
              opacity: 0.9,
            }}
          />
        )}
        {!alive && (
          <div className="absolute inset-0 flex items-center justify-center bg-[hsl(88_60%_55%)]/85">
            <div className="text-center">
              <div className="pixel-text text-xs md:text-sm">GAME OVER</div>
              <div className="pixel-text text-[10px] md:text-xs mt-2">tap to restart</div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => (alive ? drop() : reset())}
        className="pixel-text text-xs mt-2 px-3 py-1 border-2 border-[hsl(110_30%_12%)]"
        data-testid="button-drop"
      >
        {alive ? "DROP" : "RESTART"}
      </button>
      <div className="mt-1 pixel-text text-[9px] md:text-[10px] text-center opacity-70">
        space or click to drop
      </div>
    </div>
  );
}
