/**
 * THE UNIVERSE CHOSE YOU - CONFIGURATION
 * Edit these top-level variables to customize recipient name, date, and messages.
 */

export const RECIPIENT_CONFIG = {
  name: "Bhuvi",
  birthday: "10 August",
  tagline: "The Universe Chose You",
  secretPassword: "Bhuvi",
  quote: "In a galaxy of eight billion souls, your light shines standard above all stars.",
};

export interface StarMessage {
  id: number;
  title: string;
  text: string;
  category: "kindness" | "magic" | "smile" | "peace" | "wonder";
  x: number; // percentage pos 10-90
  y: number; // percentage pos 10-90
}

export const GALAXY_STARS: StarMessage[] = [
  { id: 1, title: "Star 1", text: "Enna magic panniyo theriyala... aana unna paatha odane smile vandhuduchu. ✨", category: "magic", x: 20, y: 25 },
  { id: 2, title: "Star 2", text: "Google la search pannalum, unna maari oruthanga kidaikkala. 😌", category: "smile", x: 75, y: 18 },
  { id: 3, title: "Star 3", text: "Un smile-ku brightness adjust panna sun-kooda yosikanum. ☀️", category: "wonder", x: 45, y: 60 },
  { id: 4, title: "Star 4", text: "Nee siricha... indha galaxy-ku innum konjam light vandhuruchu. 🌌", category: "smile", x: 82, y: 72 },
  { id: 5, title: "Star 5", text: "Un peru Bhuvi... aana en universe-oda center nee dhaan. 💫", category: "magic", x: 15, y: 78 },
  { id: 6, title: "Star 6", text: "En playlist-la favourite song iruku... aana adha vida favourite smile onnu iruku. 😊", category: "smile", x: 35, y: 32 },
  { id: 7, title: "Star 7", text: "Konjam careful-ah iru... romba cute-ah irukradhu legal-ah irukuma-nu doubt. 😄", category: "smile", x: 62, y: 40 },
  { id: 8, title: "Star 8", text: "Indha star-a click pannadhu vida... un presence dhaan lucky click. 🍀", category: "wonder", x: 88, y: 42 },
  { id: 9, title: "Star 9", text: "Moon-ku night shift... aana un smile-ku full-time fan. 🌙", category: "magic", x: 28, y: 85 },
  { id: 10, title: "Star 10", text: "Screenshot edukka mudiyum... aana indha moment save panna mudiyadhu. ❤️", category: "peace", x: 68, y: 82 },
  { id: 11, title: "Star 11", text: "Nee pesama irundhalum... silence kooda azhaga feel aagudhu. 🌸", category: "peace", x: 10, y: 50 },
  { id: 12, title: "Star 12", text: "Unna paatha apram dhaan... beautiful-na definition update panniten. ✨", category: "wonder", x: 52, y: 15 },
  { id: 13, title: "Star 13", text: "Butterflies stomach-la varumnu sonnaanga... nee vandha galaxy-ye fly aagudhu. 🦋", category: "magic", x: 38, y: 70 },
  { id: 14, title: "Star 14", text: "Life oru movie-na... heroine already cast aayitaanga. 🎬", category: "smile", x: 92, y: 12 },
  { id: 15, title: "Star 15", text: "Un smile-ku like button irundha... infinity click panniruppen. 💛", category: "smile", x: 22, y: 10 },
  { id: 16, title: "Star 16", text: "Indha star glow pannudhu... aana un eyes-kitta competition illa. ⭐", category: "wonder", x: 78, y: 55 },
  { id: 17, title: "Star 17", text: "Nee happy-ah irundha podhum... adhuve innaiku biggest celebration. 🎉", category: "peace", x: 48, y: 88 },
  { id: 18, title: "Star 18", text: "Universe romba perusu... aana en attention ellam orae direction. 😉", category: "magic", x: 8, y: 90 },
  { id: 19, title: "Star 19", text: "Next star click pannradhukku munadi... konjam smile pannalama? 😊", category: "smile", x: 70, y: 28 },
  { id: 20, title: "Star 20", text: "Romba yosikadhe... innum best surprise pending dhaan. 🎁", category: "wonder", x: 50, y: 48 },
  { id: 21, title: "Star 21", text: "Happy Birthday, Bhuvi! ✨ Innum konjam scroll pannina... heart full-a surprise waiting. 💖", category: "magic", x: 85, y: 85 },
];

export interface VaultEnvelope {
  id: number;
  type: "compliment" | "joke" | "dream" | "reason" | "secret";
  title: string;
  content: string;
  color: string;
}

export const VAULT_ENVELOPES: VaultEnvelope[] = [
  {
    id: 1,
    type: "compliment",
    title: "Superpower #1",
    content: "Your ability to make anyone feel comfortable within 30 seconds of meeting them.",
    color: "from-amber-500/20 to-yellow-600/20 border-amber-500/30",
  },
  {
    id: 2,
    type: "joke",
    title: "Official Science Fact",
    content: "NASA was going to name a galaxy after you, but they said your smile already shines brighter than 100 billion suns.",
    color: "from-purple-500/20 to-indigo-600/20 border-purple-500/30",
  },
  {
    id: 3,
    type: "reason",
    title: "Reason #14",
    content: "The adorable expression you make when you are genuinely surprised or happy.",
    color: "from-rose-500/20 to-pink-600/20 border-rose-500/30",
  },
  {
    id: 4,
    type: "dream",
    title: "A Future Wish",
    content: "May every path you walk lead to unexpected joy, peaceful mornings, and endless stargazing nights.",
    color: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
  },
  {
    id: 5,
    type: "compliment",
    title: "Unmatched Vibe",
    content: "You have 100% natural, organic, organic-certified main character energy without ever being arrogant.",
    color: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
  },
  {
    id: 6,
    type: "joke",
    title: "Warning Notice",
    content: "It should be illegal to look this good and be this nice at the exact same time.",
    color: "from-amber-500/20 to-orange-600/20 border-amber-500/30",
  },
  {
    id: 7,
    type: "reason",
    title: "Reason #42",
    content: "Because you make ordinary moments feel like scenes from a Ghibli movie.",
    color: "from-indigo-500/20 to-purple-600/20 border-indigo-500/30",
  },
  {
    id: 8,
    type: "secret",
    title: "The Hidden Truth",
    content: "This isn't even the surprise.",
    color: "from-yellow-400/30 to-amber-600/30 border-amber-400/50 text-amber-200",
  },
];

export const CHAPTER_LIST = [
  { id: 0, title: "Intro", label: "Origin" },
  { id: 1, title: "Chapter 1", label: "The Door Nobody Opens" },
  { id: 2, title: "Chapter 2", label: "The Galaxy of Memories" },
  { id: 3, title: "Chapter 3", label: "The Heart Machine" },
  { id: 4, title: "Chapter 4", label: "The Time Machine" },
  { id: 5, title: "Chapter 5", label: "The Secret Vault" },
  { id: 6, title: "Final Chapter", label: "The Universe" },
];
