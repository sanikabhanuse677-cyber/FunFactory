import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playGameOver, playPickup, playClick } from "@/lib/audioEngine";

const SIZE = 8;
const CELL = 22;

type Cell = [number, number]; // [row, col]
interface Shape {
  id: string;
  cells: Cell[]; // relative offsets, normalized so min row/col is 0
}

const SHAPE_LIBRARY: Cell[][] = [
  [[0, 0]],                                // 1x1
  [[0, 0], [0, 1]],                        // 1x2 line
  [[0, 0], [1, 0]],                        // 2x1 line
  [[0, 0], [0, 1], [0, 2]],                // 1x3 line
  [[0, 0], [1, 0], [2, 0]],                // 3x1 line
  [[0, 0], [0, 1], [1, 0], [1, 1]],        // 2x2 square
  [[0, 0], [1, 0], [1, 1]],                // small L
  [[0, 0], [0, 1], [1, 1]],                // mirror small L
  [[0, 0], [1, 0], [2, 0], [2, 1]],        // L
  [[0, 1], [1, 1], [2, 0], [2, 1]],        // J
  [[0, 0], [0, 1], [0, 2], [1, 0]],        // wide L
  [[0, 0], [0, 1], [0, 2], [1, 2]],        // wide J
  [[0, 0], [0, 1], [0, 2], [0, 3]],        // 1x4 line
  [[0, 0], [1, 0], [2, 0], [3, 0]],        // 4x1 line
];

function makeRandomShape(): Shape {
  const cells = SHAPE_LIBRARY[Math.floor(Math.random() * SHAPE_LIBRARY.length)];
  return { id: Math.random().toString(36).slice(2, 9), cells };
}

function makeTray(): Shape[] {
  return [makeRandomShape(), makeRandomShape(), makeRandomShape()];
}

function emptyBoard(): boolean[][] {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => false));
}

function canPlace(board: boolean[][], shape: Shape, atRow: number, atCol: number): boolean {
  for (const [r, c] of shape.cells) {
    const nr = atRow + r;
    const nc = atCol + c;
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) return false;
    if (board[nr][nc]) return false;
  }
  return true;
}

function placeShape(board: boolean[][], shape: Shape, atRow: number, atCol: number): boolean[][] {
  const next = board.map((row) => row.slice());
  for (const [r, c] of shape.cells) {
    next[atRow + r][atCol + c] = true;
  }
  return next;
}

function clearLines(board: boolean[][]): { board: boolean[][]; cleared: number; clearedCells: Cell[] } {
  const fullRows: number[] = [];
  const fullCols: number[] = [];
  for (let r = 0; r < SIZE; r++) {
    if (board[r].every((v) => v)) fullRows.push(r);
  }
  for (let c = 0; c < SIZE; c++) {
    if (board.every((row) => row[c])) fullCols.push(c);
  }
  if (fullRows.length === 0 && fullCols.length === 0) {
    return { board, cleared: 0, clearedCells: [] };
  }
  const next = board.map((row) => row.slice());
  const clearedCells: Cell[] = [];
  fullRows.forEach((r) => {
    for (let c = 0; c < SIZE; c++) {
      if (next[r][c]) clearedCells.push([r, c]);
      next[r][c] = false;
    }
  });
  fullCols.forEach((c) => {
    for (let r = 0; r < SIZE; r++) {
      if (next[r][c]) clearedCells.push([r, c]);
      next[r][c] = false;
    }
  });
  return { board: next, cleared: fullRows.length + fullCols.length, clearedCells };
}

function anyPlacement(board: boolean[][], shape: Shape): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (canPlace(board, shape, r, c)) return true;
    }
  }
  return false;
}

function shapeBounds(shape: Shape): { rows: number; cols: number } {
  let maxR = 0;
  let maxC = 0;
  for (const [r, c] of shape.cells) {
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  }
  return { rows: maxR + 1, cols: maxC + 1 };
}

export function BlockPuzzle() {
  const [board, setBoard] = useState<boolean[][]>(emptyBoard);
  const [tray, setTray] = useState<Shape[]>(makeTray);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [alive, setAlive] = useState(true);
  const [flash, setFlash] = useState<Cell[]>([]);
  const high = useMemo(() => ({ value: Number(localStorage.getItem("ff:blockpuzzle:high") ?? 0) }), []);
  const [highScore, setHighScore] = useState(high.value);

  const selected = tray.find((s) => s.id === selectedId) ?? null;

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setTray(makeTray());
    setSelectedId(null);
    setHover(null);
    setScore(0);
    setAlive(true);
    setFlash([]);
  }, []);

  const checkGameOver = useCallback((b: boolean[][], t: Shape[]) => {
    if (t.length === 0) return false;
    return !t.some((s) => anyPlacement(b, s));
  }, []);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (!alive || !selected) return;
      if (!canPlace(board, selected, r, c)) {
        playClick();
        return;
      }
      playPickup();
      const placed = placeShape(board, selected, r, c);
      const placedCount = selected.cells.length;
      const { board: cleanedBoard, cleared, clearedCells } = clearLines(placed);
      let nextScore = score + placedCount;
      if (cleared > 0) {
        nextScore += cleared * 10 + (cleared - 1) * 5;
        playPickup();
        setFlash(clearedCells);
        setTimeout(() => setFlash([]), 350);
      }
      const remaining = tray.filter((s) => s.id !== selected.id);
      const nextTray = remaining.length === 0 ? makeTray() : remaining;
      setBoard(cleanedBoard);
      setTray(nextTray);
      setSelectedId(null);
      setScore(nextScore);
      if (nextScore > highScore) {
        setHighScore(nextScore);
        try { localStorage.setItem("ff:blockpuzzle:high", String(nextScore)); } catch { /* noop */ }
      }
      if (checkGameOver(cleanedBoard, nextTray)) {
        setAlive(false);
        playGameOver();
      }
    },
    [alive, selected, board, score, tray, checkGameOver, highScore],
  );

  // hover preview cells
  const previewCells = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!hover || !selected) return set;
    if (!canPlace(board, selected, hover.row, hover.col)) return set;
    for (const [r, c] of selected.cells) {
      set.add(`${hover.row + r},${hover.col + c}`);
    }
    return set;
  }, [hover, selected, board]);

  // global Escape to deselect
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center min-h-0 select-none">
      <div className="w-full flex items-center justify-between pixel-text text-[10px] md:text-xs px-1 mb-1">
        <span>SCORE {score}</span>
        <span>HIGH {highScore}</span>
      </div>

      {/* Board */}
      <div
        className="relative border-2 border-[hsl(110_30%_12%)]"
        style={{ width: SIZE * CELL, height: SIZE * CELL, background: "hsl(88 60% 55%)" }}
      >
        {Array.from({ length: SIZE }).map((_, r) =>
          Array.from({ length: SIZE }).map((__, c) => {
            const filled = board[r][c];
            const isPreview = previewCells.has(`${r},${c}`);
            const isFlash = flash.some(([fr, fc]) => fr === r && fc === c);
            return (
              <button
                key={`${r}-${c}`}
                onMouseEnter={() => setHover({ row: r, col: c })}
                onMouseLeave={() => setHover((h) => (h && h.row === r && h.col === c ? null : h))}
                onClick={() => handleCellClick(r, c)}
                className="absolute"
                style={{
                  left: c * CELL,
                  top: r * CELL,
                  width: CELL,
                  height: CELL,
                  background: isFlash
                    ? "hsl(45 95% 60%)"
                    : filled
                    ? "hsl(110 30% 12%)"
                    : isPreview
                    ? "hsl(110 30% 12% / 0.45)"
                    : "transparent",
                  border: "1px solid hsl(110 30% 12% / 0.35)",
                  transition: "background 0.12s ease",
                }}
                data-testid={`cell-${r}-${c}`}
              />
            );
          })
        )}
      </div>

      {/* Tray */}
      <div className="mt-2 grid grid-cols-3 gap-2 w-full max-w-[240px]">
        {tray.map((shape) => (
          <ShapeTile
            key={shape.id}
            shape={shape}
            selected={selectedId === shape.id}
            onClick={() => {
              if (!alive) return;
              playClick();
              setSelectedId((s) => (s === shape.id ? null : shape.id));
            }}
          />
        ))}
      </div>

      <div className="mt-1 pixel-text text-[9px] md:text-[10px] text-center opacity-70">
        tap a shape · tap board to place
      </div>

      <AnimatePresence>
        {!alive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-[hsl(88_60%_55%)]/85 z-20"
          >
            <div className="text-center">
              <div className="pixel-text text-xs md:text-sm">GAME OVER</div>
              <div className="pixel-text text-[10px] md:text-xs mt-1">SCORE {score}</div>
              <button
                onClick={reset}
                className="pixel-text text-[11px] md:text-sm mt-3 px-3 py-1 border-2 border-[hsl(110_30%_12%)] bg-[hsl(88_60%_55%)]"
                data-testid="button-restart"
              >
                RESTART
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShapeTile({ shape, selected, onClick }: { shape: Shape; selected: boolean; onClick: () => void }) {
  const { rows, cols } = shapeBounds(shape);
  const tileCell = 10;
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`flex items-center justify-center border-2 ${
        selected ? "bg-[hsl(110_30%_12%)] border-[hsl(45_95%_60%)]" : "border-[hsl(110_30%_12%)]"
      }`}
      style={{ height: 56 }}
      data-testid={`shape-${shape.id}`}
    >
      <div className="relative" style={{ width: cols * tileCell, height: rows * tileCell }}>
        {shape.cells.map(([r, c], i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: c * tileCell,
              top: r * tileCell,
              width: tileCell,
              height: tileCell,
              background: selected ? "hsl(88 60% 55%)" : "hsl(110 30% 12%)",
              border: `1px solid ${selected ? "hsl(110 30% 12%)" : "hsl(88 60% 55%)"}`,
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}
