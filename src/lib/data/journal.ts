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
    slug: "notes-from-mirzad-road",
    title: "Notes from the Mirzad Road site",
    date: "2026-08-14",
    category: "Site",
    readingTime: "4 min",
    excerpt:
      "Two villas finished and lived in, six under way, and a decision about the garden edge that took longer than it should have.",
    cover: img(
      "1600585154363-67eb9e2e2099",
      "Dark-clad villa under a large tree at dusk, Mirzad Road",
    ),
    body: [
      {
        type: "p",
        text: "The first two villas at Mirzad Road were handed over at the start of the year and both families have been in since. Walking past them now, the thing we keep noticing is how much time is spent on the veranda rather than in the living room behind it. That was the intention, but intention and habit are different things, and it is good to see them agree.",
      },
      {
        type: "p",
        text: "Six villas remain. Structure is up on four, and the first of those has its roof on. Finishing starts after the monsoon, and handovers are phased through 2026.",
      },
      { type: "h2", text: "The garden edge" },
      {
        type: "p",
        text: "The land falls away to the south, which is what made the site worth buying and also what has taken us longest to resolve. We had drawn a low retaining wall with a timber deck sitting on top of it, running the width of each garden.",
      },
      {
        type: "p",
        text: "The October rains put more water across that edge than our survey had suggested, so the deck has moved up by 400mm and pulled back about a metre. A planted swale takes the run-off now. Better to lose a little terrace than to have it standing in water for a week each year.",
      },
      {
        type: "image",
        image: img(
          "1600573472591-ee6b68d14c68",
          "Living room with polished concrete floor opening onto a veranda",
        ),
        caption:
          "The veranda runs the full south face of each villa, deep enough to leave a door open through a downpour.",
      },
      {
        type: "quote",
        text: "A site tells you where the light comes from and where the water goes. Everything else is negotiable.",
      },
      {
        type: "p",
        text: "We will post again when the first of the six has its kitchen in.",
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
    cover: img(
      "1602216056096-3b40cc0c9944",
      "Kerala backwater under monsoon cloud, coconut palms along the bank",
    ),
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
        image: img(
          "1600607687939-ce8a6c25118c",
          "Living room with timber ceiling opening onto a garden",
        ),
        caption:
          "Timber ceilings run out to the veranda, so the room reads as one space when the doors are open.",
      },
      { type: "h2", text: "Light without heat" },
      {
        type: "p",
        text: "North light is the easy one. The harder problem is the west, where the sun comes low and hot in the evening and where, in Kochi, the best breeze also comes from. Louvred timber shutters on the west elevation let the air through and take the sun out. They are the single most useful detail we draw.",
      },
      {
        type: "p",
        text: "Perumbavoor tested that thinking hardest. An hour inland, without the sea breeze the city gets, a building has to make its own air movement or the rooms never cool down after dark. Both blocks there are single-banked, so every apartment has windows on opposite walls, and the stair halls are open to the sky and work as chimneys.",
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
      "Why most of our buyers now take the fully furnished tier, and why we think they are right to.",
    cover: img(
      "1600210491369-e753d80a41f3",
      "Minimal living room with artwork and white sofa",
    ),
    body: [
      {
        type: "p",
        text: "When we handed over the first homes at Nettoor, we offered them unfurnished, because that was what everyone did. Within a year, several of the owners had asked us to come back and help. The sofas they had bought were the wrong scale for rooms that open onto a courtyard. The curtain rails did not clear the window heads. The dining table sat under the wrong light.",
      },
      {
        type: "p",
        text: "None of this was anyone's fault. It is what happens when the people who drew the room are not the people who furnish it.",
      },
      { type: "h2", text: "What changed" },
      {
        type: "p",
        text: "So we started drawing the furniture with the house. The same proportions, the same timber, the same restraint. Pieces are sourced from makers in Kerala and Tamil Nadu, and installed by our own team in the week before handover. The owner walks into a finished room.",
      },
      {
        type: "image",
        image: img(
          "1615529182904-14819c35db37",
          "Fully furnished living room with warm light, rug and planting",
        ),
        caption:
          "A fully furnished living room the week before handover: sourced, delivered and installed by the same team.",
      },
      {
        type: "p",
        text: "Not everyone wants it, which is why all three tiers still exist. Unfurnished suits people who already own furniture they love, or who would rather take their time. Semi-furnished gets a family through the first month without committing to everything at once.",
      },
      {
        type: "p",
        text: "But most buyers now take the fully furnished tier, and the ones who do tend to say the same thing: they had underestimated how much coordination they were signing up for. We do not push it. The rooms make the argument.",
      },
    ],
  },
  {
    slug: "four-homes-on-sixteen-cents",
    title: "Four homes on sixteen cents",
    date: "2026-01-09",
    category: "Place",
    readingTime: "5 min",
    excerpt:
      "What we learned at 1008 about building densely without anyone feeling crowded.",
    cover: img(
      "1613490493576-7fde63acd811",
      "White rendered elevation with pool and planting at 1008",
    ),
    body: [
      {
        type: "p",
        text: "Sixteen cents is not much land for four homes. The obvious move on a plot that size is four identical units facing the same direction, sharing party walls, each looking at the back of the next. It is efficient and it is miserable to live in.",
      },
      {
        type: "p",
        text: "We spent most of the design time at 1008 avoiding it. The four homes ended up sitting at slightly different angles, each turned a few degrees off its neighbour. It sounds like a small thing. It is the whole project.",
      },
      { type: "h2", text: "What the angles buy" },
      {
        type: "p",
        text: "Two things. First, no window looks directly into another, so nobody closes their curtains during the day and nobody ends up living in a dim room for the sake of privacy.",
      },
      {
        type: "p",
        text: "Second, the wedge-shaped gaps that open up between the houses become small private courts, one for each home. On a deep infill plan the middle of the house is the part that goes dark. These courts fix that without borrowing an inch from anyone.",
      },
      {
        type: "image",
        image: img(
          "1600210491892-03d54c0aaf87",
          "Living room with arched windows and timber floor",
        ),
        caption:
          "Private courts pull daylight into the centre of each plan, where a deep infill house would otherwise go dark.",
      },
      {
        type: "quote",
        text: "Density is not the problem. Four houses all facing the same way is the problem.",
      },
      {
        type: "p",
        text: "All four were handed over in 2022. The families have since planted the shared entrance considerably better than we drew it, which is usually the sign that a place has been taken over properly.",
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
