import { img, type ImageRef } from "../images";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: ImageRef; caption?: string };

export interface JournalEntry {
  slug: string;
  title: string;
  date: string; // ISO
  category: string;
  excerpt: string;
  cover: ImageRef;
  readingTime: string;
  body: Block[];
}

export const journal: JournalEntry[] = [
  {
    slug: "why-we-build-in-nettoor",
    title: "Why we build in Nettoor",
    date: "2026-08-14",
    category: "Place",
    readingTime: "5 min",
    excerpt:
      "A neighbourhood on the quiet side of the city, where the land is long and low and the backwater is never far.",
    cover: img("1600607688969-a5bfcd646154", "Villa beneath a mature tree in Nettoor"),
    body: [
      {
        type: "p",
        text: "Nettoor is not on the way to anywhere. That is most of the point. The main road out of Kochi bends east before it reaches the village, and what remains is a grid of lanes, a few temples, a school, and a long edge of backwater that the palms lean over.",
      },
      {
        type: "p",
        text: "We first walked the site that became Nettoor Residences in 2021. It was a paddy holding that had not been cultivated for a decade, with a bund on its western side and a drainage channel running the length of it. The soil was soft, the water table high. It was not an obvious place to build twelve houses.",
      },
      {
        type: "h2",
        text: "Working with the ground",
      },
      {
        type: "p",
        text: "The engineering answer was piles, and we used them. The architectural answer was to raise the houses on a plinth of laterite and let the ground floor be a little above the lane, so the verandas look over the courtyard rather than into it. The channel became a planted swale. It floods for a few days each August and drains within the week.",
      },
      {
        type: "image",
        image: img("1600585153490-76fb20a32601", "Living room opening onto the courtyard"),
        caption: "Every living room at Nettoor opens onto the shared courtyard.",
      },
      {
        type: "quote",
        text: "A site tells you where the light comes from and where the water goes. Everything else is negotiable.",
      },
      {
        type: "p",
        text: "What we could not have designed is the way the neighbourhood took to the project. The tea shop on the corner has extended its awning. Two of the owners have started a shared vegetable bed in the swale. The houses were finished in March 2024; the place is still being made.",
      },
    ],
  },
  {
    slug: "designing-for-the-monsoon",
    title: "On light: designing for the Kerala monsoon",
    date: "2026-06-02",
    category: "Practice",
    readingTime: "6 min",
    excerpt:
      "Four months of rain a year is not a constraint to be managed. It is the climate the house is for.",
    cover: img("1602216056096-3b40cc0c9944", "Kerala backwater under monsoon cloud"),
    body: [
      {
        type: "p",
        text: "Most of the houses we admire in Kerala were built before air conditioning, and they are comfortable in a way that newer ones often are not. The reasons are simple and old: deep overhangs, a roof that breathes, rooms arranged so the breeze has somewhere to go.",
      },
      {
        type: "p",
        text: "We try to design for the monsoon first and the summer second. If a house is dry, shaded and ventilated in August, it will be pleasant in April. The reverse is not true.",
      },
      { type: "h2", text: "Overhangs and thresholds" },
      {
        type: "p",
        text: "Our roofs overhang by at least a metre and a half on every side. That protects the walls, keeps the driving rain off the glazing, and means a window can stay open through a downpour. The veranda becomes the room you live in for four months of the year.",
      },
      {
        type: "image",
        image: img("1600573472591-ee6b68d14c68", "Living room with concrete floor and rocking chair"),
        caption: "Polished concrete, teak and a deep veranda at Vaduthala Project Two.",
      },
      { type: "h2", text: "Light without heat" },
      {
        type: "p",
        text: "North light is the easy one. The harder problem is the west, where the sun comes low and hot in the evening and where, in Kochi, the best breeze also comes from. Louvred timber shutters on the west elevation let the air through and take the sun out. They are the single most useful detail we draw.",
      },
      {
        type: "quote",
        text: "The veranda is not an extra. In this climate it is the most important room in the house.",
      },
    ],
  },
  {
    slug: "furnishing-with-the-architect",
    title: "The case for furnishing with the architect",
    date: "2026-03-20",
    category: "Homes",
    readingTime: "4 min",
    excerpt:
      "Why three quarters of our buyers now take the fully furnished tier, and why we think they are right to.",
    cover: img("1600210491369-e753d80a41f3", "Minimal living room with artwork and white sofa"),
    body: [
      {
        type: "p",
        text: "When we handed over the first homes at Vaduthala Project One, we offered them unfurnished. Within a year, most of the owners had asked us to come back and help. The sofas they had bought were the wrong scale for the double-height room. The curtain rails did not clear the window heads. The dining table sat under the wrong light.",
      },
      {
        type: "p",
        text: "None of this was anyone's fault. It is what happens when the people who drew the room are not the people who furnish it.",
      },
      { type: "h2", text: "What changed" },
      {
        type: "p",
        text: "From Nettoor onwards we have drawn the furniture with the house. The same proportions, the same timber, the same restraint. Pieces are sourced from makers in Kerala and Tamil Nadu, and installed in the week before handover by our own team. The owner walks into a finished room.",
      },
      {
        type: "image",
        image: img("1618221195710-dd6b41faaea6", "Fully furnished living room with warm light"),
        caption: "A fully furnished living room at Nettoor Residences, the week before handover.",
      },
      {
        type: "p",
        text: "Nine of the twelve homes at Nettoor were taken fully furnished. At Vaduthala Project Two the number is already seven of ten. We do not push it. The rooms make the argument.",
      },
    ],
  },
  {
    slug: "vaduthala-site-notes-week-40",
    title: "Notes from the Vaduthala site, week 40",
    date: "2026-01-09",
    category: "Site",
    readingTime: "3 min",
    excerpt:
      "Roofs on, cladding begun, and a decision about the canal edge that took longer than it should have.",
    cover: img("1600585154084-4e5fe7c39198", "Black timber villa with lit windows at night"),
    body: [
      {
        type: "p",
        text: "All ten roofs are on at Project Two. The charred timber cladding started on the lower terrace this week, and the first panels have gone up on the villa nearest the canal. The colour reads darker in the drawings than it does on site, which is what we hoped.",
      },
      {
        type: "p",
        text: "The canal edge has been the slow question. We had drawn a low laterite wall with a timber deck above it. The water rose higher than our survey suggested in the October rains, and we have moved the deck up by 400mm and pulled it back a metre. Better to lose a little terrace than to have it under water for a week each year.",
      },
      {
        type: "image",
        image: img("1600585154526-990dced4db0d", "Villa elevation at dusk"),
        caption: "The lower terrace at dusk, before the cladding.",
      },
      {
        type: "p",
        text: "Finishing begins in February. We will post again when the first kitchen goes in.",
      },
    ],
  },
];

export const getEntry = (slug: string) => journal.find((e) => e.slug === slug);

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
