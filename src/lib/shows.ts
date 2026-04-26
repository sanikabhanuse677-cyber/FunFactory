export type ChannelId = "diy" | "preschool" | "arcade";

export interface Show {
  id: string;
  name: string;
  blurb: string;
  channel: ChannelId;
  audio: string;
  // Background & foreground for the show detail page
  bg: string;
  fg: string;
  accent: string;
  steps?: string[];
  funFact: string;
  memory: string;
}

const base = (typeof window !== "undefined" ? (import.meta.env.BASE_URL || "/") : "/").replace(/\/$/, "");

export const DIY_SHOWS: Show[] = [
  {
    id: "mad",
    name: "M.A.D.",
    blurb:
      "Music, Art & Design with Rob the host — paint splatters, recycled cardboard, and the magic of seeing a soda bottle become a spaceship.",
    channel: "diy",
    audio: `${base}/sounds/diy/mad.m4a`,
    bg: "linear-gradient(135deg, hsl(280 65% 35%), hsl(330 70% 40%), hsl(20 80% 45%))",
    fg: "hsl(45 95% 92%)",
    accent: "hsl(45 95% 60%)",
    steps: [
      "Gather: 2 plastic bottles, paint, masking tape",
      "Cut bottle tops, tape them together",
      "Paint with thick stripes and dots",
      "Add a tinfoil cone — your rocket is launch ready",
    ],
    funFact: "M.A.D. originally aired on Pogo and inspired thousands of kids to upcycle bottles long before it was trendy.",
    memory: "You always made a mess on the dining table — and your mom pretended she didn't notice.",
  },
  {
    id: "art-attack",
    name: "Art Attack",
    blurb:
      "Neil Buchanan and his giant chalk masterpieces. Sticky-back plastic, PVA glue, and that one yellow ARTBOX you wished you owned.",
    channel: "diy",
    audio: `${base}/sounds/diy/art-attack.m4a`,
    bg: "linear-gradient(135deg, hsl(45 95% 50%), hsl(20 85% 50%), hsl(355 75% 45%))",
    fg: "hsl(28 50% 12%)",
    accent: "hsl(355 80% 45%)",
    steps: [
      "Gather: paper plate, tissue paper, glue",
      "Tear tissue into small squares",
      "Glue squares onto the plate in a sun shape",
      "Add a smiley face — instant fridge art",
    ],
    funFact: "Neil Buchanan's giant 'Big Art Attacks' used everyday objects like leaves, fruit, even shoes — visible only from above.",
    memory: "You begged your parents for sticky-back plastic but ended up using cellotape instead.",
  },
  {
    id: "mister-maker",
    name: "Mister Maker",
    blurb:
      "Triangle, square, rectangle, circle… the shapes parade with friends. Every craft started with the doodle drawers.",
    channel: "diy",
    audio: `${base}/sounds/diy/mister-maker.m4a`,
    bg: "linear-gradient(135deg, hsl(190 80% 45%), hsl(170 70% 45%), hsl(45 90% 55%))",
    fg: "hsl(28 50% 12%)",
    accent: "hsl(45 95% 55%)",
    steps: [
      "Gather: paper, scissors, markers",
      "Cut out a big circle, square and triangle",
      "Combine them to make a face",
      "Decorate with patterns — meet your shape friend",
    ],
    funFact: "The Shapes — Triangle, Square, Rectangle, Circle — got their own spinoff series after fan demand.",
    memory: "You sang the shapes song under your breath in math class without realising.",
  },
  {
    id: "engineer-this",
    name: "Engineer This!",
    blurb:
      "Marble runs, popsicle bridges, and the kid in you who always wanted to build a Rube Goldberg machine in the kitchen.",
    channel: "diy",
    audio: `${base}/sounds/diy/engineer-this.m4a`,
    bg: "linear-gradient(135deg, hsl(210 70% 35%), hsl(220 60% 25%), hsl(180 65% 35%))",
    fg: "hsl(45 95% 92%)",
    accent: "hsl(180 75% 55%)",
    steps: [
      "Gather: cardboard tube, marbles, tape",
      "Cut the tube in half lengthwise",
      "Tape it to a wall in a slope",
      "Drop a marble — refine the angle until it loops",
    ],
    funFact: "Many real engineers cite cardboard-tube marble runs as their first successful 'launch'.",
    memory: "You once flooded the bathroom trying to build a 'water elevator'. Worth it.",
  },
];

export const PRESCHOOL_SHOWS: Show[] = [
  {
    id: "oswald",
    name: "Oswald",
    blurb:
      "A big blue octopus walking his hot dog Weenie through Big City. The gentlest cartoon ever animated.",
    channel: "preschool",
    audio: `${base}/sounds/preschool/oswald.m4a`,
    bg: "linear-gradient(135deg, hsl(265 65% 45%), hsl(220 70% 40%), hsl(200 60% 45%))",
    fg: "hsl(45 95% 90%)",
    accent: "hsl(45 95% 75%)",
    funFact: "Oswald was created by Dan Yaccarino — also the brain behind Doug and a children's book illustrator.",
    memory: "You wished Big City was real and that Henry the penguin was your neighbour.",
  },
  {
    id: "noddy",
    name: "Make Way for Noddy",
    blurb:
      "Toyland's tiny taxi driver — the parp-parp of his little yellow car still echoes in our heads.",
    channel: "preschool",
    audio: `${base}/sounds/preschool/noddy.m4a`,
    bg: "linear-gradient(135deg, hsl(355 80% 55%), hsl(15 85% 55%), hsl(45 95% 55%))",
    fg: "hsl(0 0% 100%)",
    accent: "hsl(45 95% 70%)",
    funFact: "Noddy first appeared in Enid Blyton's books in 1949 — meaning your parents probably watched a version too.",
    memory: "You said 'parp parp' instead of 'beep beep' for years and didn't know why.",
  },
  {
    id: "handy-manny",
    name: "Handy Manny",
    blurb:
      "Manny and his talking tools — Pat the hammer, Felipe the screwdriver. Every fix-up came with a song.",
    channel: "preschool",
    audio: `${base}/sounds/preschool/handy-manny.m4a`,
    bg: "linear-gradient(135deg, hsl(28 90% 55%), hsl(15 85% 50%), hsl(355 75% 45%))",
    fg: "hsl(0 0% 100%)",
    accent: "hsl(45 95% 70%)",
    funFact: "Manny's tool team was inspired by Mister Rogers' belief that even objects can have friendship and personality.",
    memory: "You named your dad's hammer after watching this. It's still 'Pat' today.",
  },
  {
    id: "thomas",
    name: "Thomas & Friends",
    blurb:
      "Number 1, blue, with the cheekiest face on the Island of Sodor. Tracks, tunnels, and the Fat Controller's stern stare.",
    channel: "preschool",
    audio: `${base}/sounds/preschool/thomas.m4a`,
    bg: "linear-gradient(135deg, hsl(210 80% 50%), hsl(220 70% 30%), hsl(180 60% 35%))",
    fg: "hsl(0 0% 100%)",
    accent: "hsl(45 95% 65%)",
    funFact: "Ringo Starr was the original narrator of Thomas & Friends in the UK from 1984 to 1986.",
    memory: "You owned at least one wooden Thomas track and stepped on Percy in the dark.",
  },
  {
    id: "gali-gali",
    name: "Gali Gali Sim Sim",
    blurb:
      "Indian Sesame Street with Chamki, Boombah and Googly. Hindi songs that taught a whole generation their ABCDs.",
    channel: "preschool",
    audio: `${base}/sounds/preschool/gali-gali.m4a`,
    bg: "linear-gradient(135deg, hsl(45 95% 55%), hsl(15 85% 50%), hsl(355 80% 50%))",
    fg: "hsl(0 0% 100%)",
    accent: "hsl(45 95% 75%)",
    funFact: "Chamki is a 5-year-old purple muppet who loves cricket — the first Indian Muppet to play the sport on screen.",
    memory: "You sang 'Gali Gali Sim Sim, Gali Gali Sim Sim' for at least three months straight.",
  },
  {
    id: "pingu",
    name: "Pingu",
    blurb:
      "Noot noot! A claymation penguin in Antarctica. No words, all heart, and that distinct beak-trumpet shriek.",
    channel: "preschool",
    audio: `${base}/sounds/preschool/pingu.m4a`,
    bg: "linear-gradient(135deg, hsl(195 75% 70%), hsl(210 80% 50%), hsl(220 75% 35%))",
    fg: "hsl(220 80% 12%)",
    accent: "hsl(220 90% 35%)",
    funFact: "Pingu was made in Switzerland and uses no real language — just 'Penguinese', a made-up babble.",
    memory: "You did a perfect 'noot noot' impression that made everyone laugh at the dinner table.",
  },
];

export const ARCADE_GAMES = [
  { id: "snake" as const, name: "Snake Xenzia", audio: `${base}/sounds/arcade/snake.m4a` },
  { id: "city-bloxx" as const, name: "City Bloxx", audio: `${base}/sounds/arcade/city-bloxx.m4a` },
  { id: "block-puzzle" as const, name: "Block Puzzle", audio: `${base}/sounds/arcade/block-puzzle.mp3` },
];

export const ALL_SHOWS = [...DIY_SHOWS, ...PRESCHOOL_SHOWS];

export function findShow(id: string): Show | undefined {
  return ALL_SHOWS.find((s) => s.id === id);
}
