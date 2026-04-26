import { motion } from "framer-motion";

export function HomeChannel() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      style={{
        background:
          "radial-gradient(circle at center, hsl(var(--crt-green) / 0.15) 0%, hsl(28 50% 6%) 60%, hsl(28 50% 3%) 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="display-text text-3xl md:text-5xl text-[hsl(var(--crt-amber))] glow-text"
      >
        FUN FACTORY
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mono-text text-2xl md:text-3xl text-[hsl(var(--crt-green))]/90 mt-4 glow-text"
      >
        — pick a channel —
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.7 }}
        className="mono-text text-base md:text-lg text-[hsl(var(--foreground))]/70 mt-6 max-w-md"
      >
        Use the channel buttons. Press the dice for a random memory.
      </motion.div>

      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="mono-text text-2xl text-[hsl(var(--crt-amber))] mt-10"
      >
        ▮
      </motion.div>
    </div>
  );
}
