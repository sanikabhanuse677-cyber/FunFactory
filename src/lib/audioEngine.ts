// Lightweight Web Audio engine for Fun Factory.
// Synthesizes all UI/effect sounds; show "music" loads from optional MP3 placeholders.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentOscillators: OscillatorNode[] = [];
let currentAudio: HTMLAudioElement | null = null;
let userVolume = 0.6;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    ctx = new Ctx();
    masterGain = ctx.createGain();
    masterGain.gain.value = userVolume;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

export function unlockAudio(): void {
  const c = getCtx();
  if (c.state === "suspended") void c.resume();
}

// True if the audio context exists AND is currently running. Use this to
// guard sounds that should only play when the user has already interacted
// with the page — otherwise the sound would queue up and play late.
export function isAudioReady(): boolean {
  return ctx !== null && ctx.state === "running";
}

export function setVolume(v: number): void {
  userVolume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = muted ? 0 : userVolume;
  if (currentAudio) currentAudio.volume = muted ? 0 : userVolume;
}

export function setMuted(m: boolean): void {
  muted = m;
  if (masterGain) masterGain.gain.value = muted ? 0 : userVolume;
  if (currentAudio) currentAudio.volume = muted ? 0 : userVolume;
}

export function getVolume(): number {
  return userVolume;
}

export function isMuted(): boolean {
  return muted;
}

export function stopAll(): void {
  try {
    currentOscillators.forEach((o) => {
      try { o.stop(); } catch { /* noop */ }
    });
  } catch { /* noop */ }
  currentOscillators = [];
  if (currentSource) {
    try { currentSource.stop(); } catch { /* noop */ }
    currentSource = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch { /* noop */ }
    currentAudio = null;
  }
}

function createNoiseBuffer(durationMs: number): AudioBuffer {
  const c = getCtx();
  const length = Math.floor((c.sampleRate * durationMs) / 1000);
  const buf = c.createBuffer(1, length, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

export function playStatic(durationMs = 400, intensity = 0.4): void {
  const c = getCtx();
  const buf = createNoiseBuffer(durationMs);
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.value = intensity;
  // High-pass filter for crispier static
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  src.connect(hp);
  hp.connect(gain);
  gain.connect(getMaster());
  src.start();
  src.stop(c.currentTime + durationMs / 1000);
}

export function playClick(): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(620, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.07);
  gain.gain.setValueAtTime(0.15, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.09);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start();
  osc.stop(c.currentTime + 0.1);
}

export function playPowerOn(): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.6);
  gain.gain.setValueAtTime(0.001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.7);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start();
  osc.stop(c.currentTime + 0.75);
  playStatic(250, 0.25);
}

export function playPowerOff(): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(440, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.5);
  gain.gain.setValueAtTime(0.18, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.55);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start();
  osc.stop(c.currentTime + 0.6);
}

// A short "channel switch" sweep on top of static
export function playChannelSwitch(): void {
  playStatic(380, 0.35);
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(900, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.25);
  gain.gain.setValueAtTime(0.08, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start();
  osc.stop(c.currentTime + 0.32);
}

// Eat sound for snake
export function playPickup(): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(660, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(990, c.currentTime + 0.08);
  gain.gain.setValueAtTime(0.18, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start();
  osc.stop(c.currentTime + 0.12);
}

export function playGameOver(): void {
  const c = getCtx();
  const notes = [392, 330, 262, 196];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    const t = c.currentTime + i * 0.13;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(gain);
    gain.connect(getMaster());
    osc.start(t);
    osc.stop(t + 0.18);
  });
}

// Cheerful synth jingle, varied per show via seed
export function playJingle(seed: string): void {
  stopAll();
  const c = getCtx();
  // Cheerful pentatonic-ish pattern derived from string hash
  const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const len = 8;
  const notes: number[] = [];
  for (let i = 0; i < len; i++) {
    const idx = (h >>> (i * 3)) % scale.length;
    notes.push(scale[idx] ?? scale[0]);
  }

  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const t = c.currentTime + i * 0.18;
    osc.type = i % 2 === 0 ? "triangle" : "square";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(gain);
    gain.connect(getMaster());
    osc.start(t);
    osc.stop(t + 0.24);
    currentOscillators.push(osc);
  });
}

// Play the show's real audio file. If the file is missing/empty/blocked,
// fall back to a synth jingle so something always plays.
export function playShowAudio(filePath: string, jingleSeed: string): void {
  stopAll();

  let audio: HTMLAudioElement;
  try {
    audio = new Audio(filePath);
  } catch {
    playJingle(jingleSeed);
    return;
  }

  audio.loop = true;
  audio.preload = "auto";
  audio.volume = muted ? 0 : userVolume;
  currentAudio = audio;

  // Hard error (file not found, decode error) → fall back immediately.
  audio.addEventListener("error", () => {
    if (currentAudio === audio) {
      currentAudio = null;
      playJingle(jingleSeed);
    }
  });

  // Try to start playback immediately. play() resolves as soon as the
  // browser has enough data to begin, so there's no perceived delay.
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked or file unavailable — fall back to jingle.
      if (currentAudio === audio) {
        currentAudio = null;
        playJingle(jingleSeed);
      }
    });
  }

  // Safety net: if real audio hasn't actually started within 1.2s
  // (slow network, big file), kick the jingle in so the user hears something.
  setTimeout(() => {
    if (currentAudio === audio && audio.paused) {
      currentAudio = null;
      try { audio.pause(); } catch { /* noop */ }
      playJingle(jingleSeed);
    }
  }, 1200);
}

export function playBootTone(): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(660, c.currentTime + 2.4);
  gain.gain.setValueAtTime(0.001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 2.6);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start();
  osc.stop(c.currentTime + 2.7);
  currentOscillators.push(osc);
  // Add gentle static under it
  playStatic(2400, 0.08);
}
