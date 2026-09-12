import { img, type ImageRef } from "../images";

export type ProjectStatus = "Completed" | "Ongoing" | "Upcoming";
export type Area =
  "Vaduthala" | "Nettoor" | "Perumbavoor" | "Mirzad Road" | "Kochi";
export type TierKey = "unfurnished" | "semi" | "fully";

export interface Room {
  name: string;
  /** dimensions in feet, e.g. "14' × 12'" */
  dims: string;
  /** plan geometry on a 100 × 100 grid */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FloorPlan {
  label: string;
  area: string;
  rooms: Room[];
}

export interface GalleryItem {
  image: ImageRef;
  caption?: string;
  layout: "full" | "half" | "pinned";
}

/** Price in lakhs. `max` present means the project is quoted as a range. */
export interface Price {
  min: number;
  max?: number;
}

export interface Project {
  slug: string;
  name: string;
  location: string;
  area: Area;
  status: ProjectStatus;
  /** Absent for projects not yet dated (upcoming). */
  year?: number;
  /** Short phrase for cards and metadata, e.g. "2 buildings, 14 units". */
  configuration: string;
  /** Total homes, where a firm number exists. */
  units?: number;
  unitTypes: string;
  plotArea: string;
  builtUp: string;
  completion: string;
  /** Unfurnished price. The other two tiers are derived from it. */
  basePrice: Price;
  /** Sold out: show no prices and no enquiry CTAs for this project. */
  soldOut: boolean;
  summary: string;
  cover: ImageRef;
  portrait: ImageRef;
  overview: string[];
  gallery: GalleryItem[];
  floorPlans: { ground: FloorPlan; first: FloorPlan };
  specs: { category: string; items: string[] }[];
  mapQuery: string;
  distances: { place: string; distance: string }[];
  /** PDF under /public. Absent → request over WhatsApp, or hidden if sold out. */
  catalogUrl?: string;
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

/** Lakhs added to the unfurnished price for each tier. */
export const TIER_UPLIFT: Record<TierKey, number> = {
  unfurnished: 0,
  semi: 5,
  fully: 15,
};

export function tierPrice(base: Price, tier: TierKey): Price {
  const up = TIER_UPLIFT[tier];
  return base.max === undefined
    ? { min: base.min + up }
    : { min: base.min + up, max: base.max + up };
}

export function formatPrice(p: Price) {
  return p.max === undefined
    ? `₹${p.min} Lakhs`
    : `₹${p.min} – ₹${p.max} Lakhs`;
}

/** Price for a tier, or null when the project is sold out. */
export function tierPriceLabel(project: Project, tier: TierKey) {
  if (project.soldOut) return null;
  return formatPrice(tierPrice(project.basePrice, tier));
}

/* ------------------------------------------------------------------ */
/* Tiers                                                               */
/* ------------------------------------------------------------------ */

export const tiers: {
  key: TierKey;
  numeral: string;
  name: string;
  tagline: string;
  copy: string;
  includes: string[];
}[] = [
  {
    key: "unfurnished",
    numeral: "01",
    name: "Unfurnished",
    tagline: "The structure, finished. Yours to shape.",
    copy: "The architecture complete: flooring laid, walls finished, wiring and plumbing in, kitchen and bathrooms fitted. Everything else is a decision you make in your own time.",
    includes: [
      "Structure and finishes",
      "Flooring throughout",
      "Modular kitchen",
      "Wardrobes in all bedrooms",
      "Lighting points and fans",
      "Landscaping",
    ],
  },
  {
    key: "semi",
    numeral: "02",
    name: "Semi-Furnished",
    tagline: "Essentials in place. Move in, settle slowly.",
    copy: "Beds, wardrobes, dining and seating chosen to suit the plan. The house works from the first night; the layers that make it personal can follow.",
    includes: [
      "Everything in Unfurnished",
      "Bedroom furniture",
      "Living room seating and dining",
      "Light fittings and fans",
      "Curtains and blinds",
      "Handover support",
    ],
  },
  {
    key: "fully",
    numeral: "03",
    name: "Fully Furnished",
    tagline: "Complete. Designed to match the architecture. Move in and live.",
    copy: "Furnishing drawn by the same team that drew the house, so proportions, timber and light agree with one another. Sourced, delivered and installed before the keys change hands. Nothing to coordinate.",
    includes: [
      "Everything in Semi-Furnished",
      "Rugs, artwork and objects",
      "Soft furnishing and linen",
      "Kitchen and dining ware",
      "Planting, indoors and out",
      "A walk-through on handover day",
    ],
  },
];

export const comparisonRows: {
  feature: string;
  tiers: [boolean, boolean, boolean];
}[] = [
  { feature: "Structure and finishes", tiers: [true, true, true] },
  { feature: "Flooring", tiers: [true, true, true] },
  { feature: "Modular kitchen", tiers: [true, true, true] },
  { feature: "Wardrobes", tiers: [true, true, true] },
  { feature: "Bedroom furniture", tiers: [false, true, true] },
  { feature: "Living room furniture", tiers: [false, true, true] },
  { feature: "Lighting and fans", tiers: [false, true, true] },
  { feature: "Curtains and soft furnishing", tiers: [false, true, true] },
  { feature: "Rugs and decor", tiers: [false, false, true] },
  { feature: "Artwork", tiers: [false, false, true] },
  { feature: "Landscaping", tiers: [true, true, true] },
  { feature: "Handover support", tiers: [false, true, true] },
];

/* ------------------------------------------------------------------ */
/* Specifications                                                      */
/* ------------------------------------------------------------------ */

const defaultSpecs = (variant: "villa" | "apartment") => [
  {
    category: "Structure and construction",
    items: [
      "RCC framed structure designed for Kochi's seismic zone III",
      'Solid cement block masonry, 8" external, 6" internal',
      "Termite-treated foundation and plinth",
      "Weather-shield exterior emulsion over textured putty",
      variant === "villa"
        ? "Sloped clay-tile roof over insulated RCC slab"
        : "Waterproofed terrace with heat-reflective coating",
    ],
  },
  {
    category: "Flooring and finishes",
    items: [
      "800 × 800 vitrified tiles in living and dining",
      "Engineered timber flooring in bedrooms",
      "Natural Kota stone on verandas and utility",
      "Anti-skid ceramic in bathrooms and balconies",
      "Two-coat acrylic emulsion on all internal walls",
    ],
  },
  {
    category: "Doors and windows",
    items: [
      "Solid teak main door, 40mm, with brass fittings",
      "Flush doors with laminate finish internally",
      "UPVC sliding windows with toughened glass",
      "Mosquito mesh to all openable windows",
      "Timber louvred shutters on west elevations",
    ],
  },
  {
    category: "Kitchen",
    items: [
      "Granite counter with under-mount sink",
      "Modular carcass in marine ply, laminate shutters",
      "Provision for chimney, hob and water purifier",
      "Dado tiling to 2 ft above counter",
      "Separate utility with washing machine point",
    ],
  },
  {
    category: "Bathrooms",
    items: [
      "Sanitaryware from Kohler or equivalent",
      "Chrome-plated fittings from Jaquar or equivalent",
      "Concealed plumbing, hot and cold lines",
      "Glass shower partition in master bathroom",
      "Solar water heater connection to all bathrooms",
    ],
  },
  {
    category: "Electrical",
    items: [
      "Concealed copper wiring, Finolex or equivalent",
      "Modular switches from Legrand or equivalent",
      "Three-phase supply with ELCB protection",
      "AC points in all bedrooms and living",
      "Inverter wiring for lights and fans",
      "Data and TV points in living and bedrooms",
    ],
  },
  {
    category: "Exterior and landscaping",
    items: [
      "Compound wall with laterite cladding",
      "Paved driveway in cobble or grass pavers",
      "Rainwater harvesting with recharge pit",
      "Native planting scheme with drip irrigation",
      "External lighting on timer circuit",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Floor plans                                                         */
/* ------------------------------------------------------------------ */

const villaGround: FloorPlan = {
  label: "Ground Floor",
  area: "1,120 sq ft",
  rooms: [
    { name: "Veranda", dims: "18' × 6'", x: 4, y: 4, w: 56, h: 12 },
    { name: "Living", dims: "18' × 14'", x: 4, y: 16, w: 40, h: 34 },
    { name: "Dining", dims: "14' × 12'", x: 44, y: 16, w: 32, h: 26 },
    { name: "Kitchen", dims: "12' × 10'", x: 76, y: 16, w: 20, h: 26 },
    { name: "Utility", dims: "8' × 6'", x: 76, y: 42, w: 20, h: 12 },
    { name: "Bedroom 1", dims: "14' × 12'", x: 4, y: 50, w: 34, h: 30 },
    { name: "Bath", dims: "8' × 5'", x: 38, y: 50, w: 14, h: 14 },
    { name: "Stair", dims: "10' × 8'", x: 52, y: 42, w: 24, h: 22 },
    { name: "Powder", dims: "6' × 5'", x: 38, y: 64, w: 14, h: 16 },
    { name: "Study", dims: "10' × 10'", x: 52, y: 64, w: 44, h: 32 },
    { name: "Garden", dims: "—", x: 4, y: 80, w: 48, h: 16 },
  ],
};

const villaFirst: FloorPlan = {
  label: "First Floor",
  area: "980 sq ft",
  rooms: [
    { name: "Family Lounge", dims: "16' × 12'", x: 4, y: 4, w: 44, h: 30 },
    { name: "Balcony", dims: "16' × 5'", x: 48, y: 4, w: 48, h: 12 },
    { name: "Master Bedroom", dims: "16' × 14'", x: 48, y: 16, w: 48, h: 34 },
    { name: "Master Bath", dims: "10' × 6'", x: 48, y: 50, w: 22, h: 14 },
    { name: "Walk-in", dims: "8' × 6'", x: 70, y: 50, w: 26, h: 14 },
    { name: "Bedroom 3", dims: "14' × 12'", x: 4, y: 34, w: 30, h: 30 },
    { name: "Bath", dims: "8' × 5'", x: 34, y: 34, w: 14, h: 16 },
    { name: "Stair", dims: "10' × 8'", x: 34, y: 50, w: 14, h: 14 },
    { name: "Terrace", dims: "24' × 12'", x: 4, y: 64, w: 92, h: 32 },
  ],
};

const apartmentGround: FloorPlan = {
  label: "Typical Floor",
  area: "1,380 sq ft",
  rooms: [
    { name: "Foyer", dims: "8' × 6'", x: 4, y: 4, w: 20, h: 14 },
    { name: "Living", dims: "20' × 14'", x: 24, y: 4, w: 44, h: 36 },
    { name: "Balcony", dims: "14' × 5'", x: 68, y: 4, w: 28, h: 12 },
    { name: "Dining", dims: "14' × 12'", x: 68, y: 16, w: 28, h: 24 },
    { name: "Kitchen", dims: "12' × 10'", x: 68, y: 40, w: 28, h: 24 },
    { name: "Utility", dims: "8' × 5'", x: 68, y: 64, w: 28, h: 10 },
    { name: "Bedroom 1", dims: "14' × 12'", x: 4, y: 18, w: 34, h: 30 },
    { name: "Bath", dims: "8' × 5'", x: 38, y: 40, w: 14, h: 14 },
    { name: "Bedroom 2", dims: "13' × 12'", x: 4, y: 48, w: 34, h: 30 },
    { name: "Bath", dims: "8' × 5'", x: 38, y: 54, w: 14, h: 14 },
    { name: "Stair and lift", dims: "10' × 8'", x: 52, y: 40, w: 16, h: 34 },
    { name: "Store", dims: "6' × 5'", x: 38, y: 68, w: 14, h: 10 },
    { name: "Deck", dims: "24' × 8'", x: 4, y: 78, w: 92, h: 18 },
  ],
};

const apartmentUpper: FloorPlan = {
  label: "Upper Floor",
  area: "1,020 sq ft",
  rooms: [
    { name: "Master Bedroom", dims: "18' × 14'", x: 4, y: 4, w: 48, h: 40 },
    { name: "Walk-in", dims: "9' × 6'", x: 52, y: 4, w: 20, h: 20 },
    { name: "Master Bath", dims: "10' × 7'", x: 52, y: 24, w: 20, h: 20 },
    { name: "Study", dims: "12' × 10'", x: 72, y: 4, w: 24, h: 40 },
    { name: "Family", dims: "16' × 12'", x: 4, y: 44, w: 48, h: 30 },
    { name: "Stair", dims: "10' × 8'", x: 52, y: 44, w: 20, h: 30 },
    { name: "Bedroom 4", dims: "12' × 11'", x: 72, y: 44, w: 24, h: 30 },
    { name: "Terrace Garden", dims: "24' × 8'", x: 4, y: 74, w: 92, h: 22 },
  ],
};

/* ------------------------------------------------------------------ */
/* Tier switcher imagery                                               */
/* ------------------------------------------------------------------ */

/**
 * The same living room in three states, used by the tier switcher.
 * Shared across projects until project-specific photography is shot.
 */
const tierImages: Record<TierKey, ImageRef> = {
  unfurnished: img(
    "1630699144867-37acec97df5a",
    "The living room unfurnished: bare timber floor, white walls and sliding doors to the garden",
  ),
  semi: img(
    "1616486338812-3dadae4b4ace",
    "The same living room semi-furnished: sofa, ottoman and a side table in place",
  ),
  fully: img(
    "1615529182904-14819c35db37",
    "The same living room fully furnished: seating, rug, lighting, artwork and planting",
  ),
};

export { tierImages };

/* ------------------------------------------------------------------ */
/* The portfolio, newest first                                         */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: "taqva-road-vaduthala",
    name: "Taqva Road",
    location: "Taqva Road, Vaduthala, Kochi",
    area: "Vaduthala",
    status: "Upcoming",
    configuration: "3 buildings",
    unitTypes: "2 and 3 bedroom apartments",
    plotArea: "24 cents",
    builtUp: "1,100 – 1,650 sq ft",
    completion: "Register opening 2026",
    basePrice: { min: 55 },
    soldOut: false,
    summary:
      "Three buildings on a narrow lane off Taqva Road, planned around the light the site already has.",
    cover: img(
      "1600585154340-be6161a56a0c",
      "Taqva Road: timber and dark-clad elevation at dusk beneath a mature tree",
    ),
    portrait: img(
      "1600585154526-990dced4db0d",
      "Taqva Road: elevation study at dusk with lit windows",
    ),
    overview: [
      "Taqva Road is a quiet lane off the main Vaduthala stretch, close enough to the market to walk and far enough back that the noise does not follow you home. The plot is narrow and deep, which rules out one large block and suggests three smaller ones instead.",
      "That is what we are building: three buildings set apart with planted gaps between them, so every apartment takes light and air from two sides rather than one. The gaps do the work that a courtyard does in an older Kerala house. Living rooms face east for the morning; kitchens and utilities take the west wall, where the afternoon heat can be absorbed by something other than a room you sit in.",
      "Drawings are with the planning authority and we expect to open the register in 2026. Prices start at ₹55 Lakhs unfurnished. If you would like to be told when the first building is released, leave your number and we will call before anything is advertised.",
    ],
    gallery: [
      {
        image: img(
          "1600585153490-76fb20a32601",
          "Living room opening to a planted gap between buildings",
        ),
        caption:
          "The planted gaps between the three buildings give every apartment light and cross-ventilation from two sides.",
        layout: "full",
      },
      {
        image: img("1600607687126-8a3414349a51", "Bedroom with morning light"),
        layout: "half",
      },
      {
        image: img(
          "1600585152220-90363fe7e115",
          "Kitchen with island and pendant lights",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600607687939-ce8a6c25118c",
          "Living room with timber ceiling opening onto a garden",
        ),
        caption:
          "Living rooms face east. The timber ceiling carries through to the balcony so the room reads as one space.",
        layout: "pinned",
      },
    ],
    floorPlans: { ground: apartmentGround, first: apartmentUpper },
    specs: defaultSpecs("apartment"),
    mapQuery: "Taqva Road, Vaduthala, Kochi, Kerala",
    distances: [
      { place: "Vaduthala Junction", distance: "0.9 km" },
      { place: "Ernakulam North station", distance: "4.4 km" },
      { place: "Lulu Mall, Edappally", distance: "5.3 km" },
      { place: "Infopark, Kakkanad", distance: "12 km" },
      { place: "Cochin International Airport", distance: "27 km" },
    ],
    catalogUrl: "/catalogs/taqva-road-vaduthala.pdf",
  },
  {
    slug: "mirzad-road",
    name: "Mirzad Road",
    location: "Mirzad Road, Kochi",
    area: "Mirzad Road",
    status: "Ongoing",
    year: 2025,
    configuration: "Villas — 2 completed, 6 upcoming",
    units: 8,
    unitTypes: "3 and 4 bedroom villas",
    plotArea: "32 cents",
    builtUp: "1,750 – 2,300 sq ft",
    completion: "Phased through 2026",
    basePrice: { min: 70 },
    soldOut: false,
    summary:
      "Eight villas along Mirzad Road, built in phases. Two are finished and lived in; six follow.",
    cover: img(
      "1600585154363-67eb9e2e2099",
      "Mirzad Road: dark-clad villa under a large tree at dusk",
    ),
    portrait: img(
      "1600585154084-4e5fe7c39198",
      "Mirzad Road: villa elevation at night with lit windows",
    ),
    overview: [
      "Mirzad Road runs along a slight ridge, which is unusual enough in this part of Kochi to be worth designing around. The land falls away to the south, so we set the villas along the high edge and let their gardens step down behind them.",
      "Each villa turns its back on the road and opens south into its own garden. A veranda runs the full width of that south face, deep enough to keep the monsoon off an open door and to be usable as a room for the four months when sitting outside is the only sensible thing to do. Upstairs, the bedrooms take the same orientation, with louvred shutters on the west so the evening breeze comes through without the evening sun.",
      "Two villas are complete and occupied. The remaining six are under construction and will be handed over in phases through 2026. Prices start at ₹70 Lakhs unfurnished, and all three levels of finish are available on the six still to come.",
    ],
    gallery: [
      {
        image: img(
          "1600573472591-ee6b68d14c68",
          "Living room with polished concrete floor opening to a veranda",
        ),
        caption:
          "The veranda runs the full south face. In the monsoon it is the room the house actually lives in.",
        layout: "full",
      },
      {
        image: img(
          "1600607687644-c7171b42498f",
          "Bedroom with linen and garden view",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600607686527-6fb886090705",
          "Kitchen with white counters and oak joinery",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600566753086-00f18fb6b3ea",
          "Double-height living room with timber floor",
        ),
        caption:
          "Stair halls are lit from above, so the centre of the plan never needs a lamp during the day.",
        layout: "pinned",
      },
      {
        image: img(
          "1600573472592-401b489a3cdc",
          "Villa elevation with courtyard and pool, late afternoon",
        ),
        layout: "full",
      },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    mapQuery: "Mirzad Road, Kochi, Kerala",
    distances: [
      { place: "Vaduthala Junction", distance: "2.4 km" },
      { place: "Ernakulam North station", distance: "3.8 km" },
      { place: "Lulu Mall, Edappally", distance: "6.2 km" },
      { place: "Infopark, Kakkanad", distance: "11.5 km" },
      { place: "Cochin International Airport", distance: "28 km" },
    ],
    catalogUrl: "/catalogs/mirzad-road.pdf",
  },
  {
    slug: "1008",
    name: "1008",
    location: "Kochi",
    area: "Kochi",
    status: "Completed",
    year: 2022,
    configuration: "4 homes",
    units: 4,
    unitTypes: "3 bedroom homes",
    plotArea: "16 cents",
    builtUp: "1,450 – 1,900 sq ft",
    completion: "2022",
    basePrice: { min: 45, max: 65 },
    soldOut: true,
    summary:
      "Four homes on a small infill plot, arranged so none of them looks into another.",
    cover: img(
      "1613490493576-7fde63acd811",
      "1008: white rendered elevation with pool and planting",
    ),
    portrait: img(
      "1600566752355-35792bedcfea",
      "1008: bathroom with stone vanity and garden window",
    ),
    overview: [
      "Sixteen cents is not much land for four homes, and the temptation on a plot this size is to put up four identical boxes facing the same way. We spent most of the design time avoiding that.",
      "The four homes sit at slightly different angles, each one turned a few degrees off its neighbour so that no window looks directly into another. The gaps that opens up became small private courts, one per house, which pull light into the middle of plans that are otherwise quite deep. Two homes got a double-height living room; the other two traded that for a larger terrace upstairs.",
      "All four were handed over in 2022 and are lived in by families who, between them, have since planted the shared entrance far better than we drew it. The project is complete and sold out.",
    ],
    gallery: [
      {
        image: img(
          "1600210491892-03d54c0aaf87",
          "Living room with arched windows and timber floor",
        ),
        caption:
          "Private courts pull daylight into the middle of each plan, where a deep infill house would otherwise go dark.",
        layout: "full",
      },
      {
        image: img("1600607688066-890987f18a86", "Bathroom with marble vanity"),
        layout: "half",
      },
      {
        image: img(
          "1600607687920-4e2a09cf159d",
          "Dining room with timber table beside the garden",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600566753051-f0b89df2dd90",
          "Bedroom with timber floor and floor-to-ceiling glazing",
        ),
        caption:
          "Each home is turned a few degrees off its neighbour, so no bedroom window faces another.",
        layout: "pinned",
      },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    mapQuery: "Kochi, Kerala",
    distances: [
      { place: "Ernakulam South station", distance: "3.4 km" },
      { place: "Marine Drive", distance: "4.1 km" },
      { place: "Lulu Mall, Edappally", distance: "7.8 km" },
      { place: "Infopark, Kakkanad", distance: "13 km" },
      { place: "Cochin International Airport", distance: "30 km" },
    ],
  },
  {
    slug: "perumbavoor",
    name: "Perumbavoor",
    location: "Perumbavoor, Ernakulam",
    area: "Perumbavoor",
    status: "Completed",
    year: 2021,
    configuration: "2 buildings, 14 units",
    units: 14,
    unitTypes: "2 and 3 bedroom apartments",
    plotArea: "38 cents",
    builtUp: "980 – 1,420 sq ft",
    completion: "2021",
    basePrice: { min: 35 },
    soldOut: true,
    summary:
      "Fourteen apartments in two buildings, our first project outside Kochi city.",
    cover: img(
      "1600047509807-ba8f99d2cdde",
      "Perumbavoor: brick and timber elevation with planting",
    ),
    portrait: img(
      "1600563438938-a9a27216b4f5",
      "Perumbavoor: white rendered elevation study",
    ),
    overview: [
      "Perumbavoor is an hour inland from Kochi and noticeably hotter for it. Without the sea breeze the city gets, a building here has to make its own air movement or the rooms simply do not cool down after dark.",
      "The two buildings are set on either side of a planted central court and turned so the prevailing evening wind runs between them rather than around. Every apartment is single-banked, which means each one has windows on opposite walls and a through-draught on any evening with wind in it. The stair halls are open to the sky and act as chimneys, pulling warm air up and out of the corridors.",
      "Fourteen apartments were handed over in 2021 at prices starting from ₹35 Lakhs. They sold to families who mostly already lived in the town, which we took as the best verdict available. The project is complete and sold out.",
    ],
    gallery: [
      {
        image: img(
          "1600047509358-9dc75507daeb",
          "Brick and timber elevation with deep balconies",
        ),
        caption:
          "Both buildings are single-banked, so every apartment has windows on opposite walls and a through-draught.",
        layout: "full",
      },
      {
        image: img(
          "1600210492486-724fe5c67fb0",
          "Living room with gallery wall and seating",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600489000022-c2086d79f9d4",
          "Kitchen in deep green with timber counter",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600210491369-e753d80a41f3",
          "Minimal living room with white sofa and artwork",
        ),
        caption:
          "Open stair halls act as chimneys, drawing warm air up and out of the corridors after dark.",
        layout: "pinned",
      },
    ],
    floorPlans: { ground: apartmentGround, first: apartmentUpper },
    specs: defaultSpecs("apartment"),
    mapQuery: "Perumbavoor, Ernakulam, Kerala",
    distances: [
      { place: "Perumbavoor town centre", distance: "1.3 km" },
      { place: "Aluva railway station", distance: "16 km" },
      { place: "Cochin International Airport", distance: "21 km" },
      { place: "Infopark, Kakkanad", distance: "26 km" },
      { place: "Ernakulam North station", distance: "31 km" },
    ],
  },
  {
    slug: "vaduthala-salafi",
    name: "Vaduthala, Near Salafi",
    location: "Near Salafi, Vaduthala, Kochi",
    area: "Vaduthala",
    status: "Completed",
    year: 2020,
    configuration: "2 homes",
    units: 2,
    unitTypes: "3 bedroom homes",
    plotArea: "11 cents",
    builtUp: "1,560 – 1,700 sq ft",
    completion: "2020",
    basePrice: { min: 45 },
    soldOut: true,
    summary:
      "Two homes on a tight plot near Salafi, built for two families who wanted to stay neighbours.",
    cover: img(
      "1600596542815-ffad4c1539a9",
      "Vaduthala Near Salafi: white villa elevation with pool and planting",
    ),
    portrait: img(
      "1600607688969-a5bfcd646154",
      "Vaduthala Near Salafi: villa exterior beneath a mature tree",
    ),
    overview: [
      "Two families who had been neighbours for years bought a single plot near Salafi and asked whether we could put two houses on it without either of them losing the garden they already had.",
      "Eleven cents does not divide neatly into two comfortable houses, so we did not divide it. The two homes share a single boundary wall and a common entrance court, and each opens to its own side garden rather than to a strip at the back. A screen wall between the two verandas gives privacy without cutting the light, and both kitchens look onto the shared court, which is where most of the conversation still happens.",
      "Both homes were finished in 2020 at ₹45 Lakhs each, unfurnished. The families moved the week after handover and have since put a gate in the screen wall. The project is complete and sold out.",
    ],
    gallery: [
      {
        image: img(
          "1600585154340-be6161a56a0c",
          "Two homes sharing an entrance court at dusk",
        ),
        caption:
          "A screen wall between the verandas gives both families privacy without taking the light from either.",
        layout: "full",
      },
      {
        image: img(
          "1600607687126-8a3414349a51",
          "Bedroom with grey linen and morning light",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600566753190-17f0baa2a6c3",
          "Timber-clad elevation at dusk",
        ),
        layout: "half",
      },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    mapQuery: "Vaduthala, Kochi, Kerala",
    distances: [
      { place: "Vaduthala Junction", distance: "0.6 km" },
      { place: "Ernakulam North station", distance: "4.0 km" },
      { place: "Lulu Mall, Edappally", distance: "5.0 km" },
      { place: "Infopark, Kakkanad", distance: "12 km" },
      { place: "Cochin International Airport", distance: "27 km" },
    ],
  },
  {
    slug: "nettoor-residences",
    name: "Nettoor Residences",
    location: "Nettoor, Kochi",
    area: "Nettoor",
    status: "Completed",
    year: 2016,
    configuration: "7 apartments and 7 villas — 14 units total",
    units: 14,
    unitTypes: "2 and 3 bedroom apartments, 3 bedroom villas",
    plotArea: "44 cents",
    builtUp: "1,150 – 2,200 sq ft",
    completion: "2016",
    basePrice: { min: 65, max: 75 },
    soldOut: true,
    summary:
      "Our first project: seven apartments and seven villas around a shared courtyard, a short walk from the backwater.",
    cover: img(
      "1600566753190-17f0baa2a6c3",
      "Nettoor Residences: timber-clad villa elevation at dusk",
    ),
    portrait: img(
      "1600573472592-401b489a3cdc",
      "Nettoor Residences: courtyard and pool between the villas",
    ),
    overview: [
      "Nettoor sits on the quieter edge of Kochi, where the road narrows and the coconut palms begin to outnumber the buildings. The site was a former paddy holding, long and low, with the backwater a few hundred metres west. It was the first piece of land we bought, and the first time we had to answer the question of what a Citysky building should actually be.",
      "The answer was a courtyard. Seven villas along one edge, an apartment block of seven along the other, and a planted green between them that every living room opens onto. Villas took a sloped clay-tile roof with an overhang deep enough to leave a window open through a downpour; the apartments took deep balconies for the same reason. Because the water table here is high, everything sits on a laterite plinth a little above the lane, so the verandas look over the courtyard rather than into it.",
      "All fourteen homes were handed over in 2016 and the courtyard has been theirs ever since — two of the owners started a vegetable bed in the drainage swale we planted, which was not on any drawing. The project is complete and sold out.",
    ],
    gallery: [
      {
        image: img(
          "1600585153490-76fb20a32601",
          "Living room opening onto the shared courtyard garden",
        ),
        caption:
          "Every living room, villa and apartment alike, opens onto the shared courtyard.",
        layout: "full",
      },
      {
        image: img(
          "1600566753051-f0b89df2dd90",
          "Bedroom with timber floor and floor-to-ceiling glazing",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600607687920-4e2a09cf159d",
          "Dining room with timber table beside the garden",
        ),
        layout: "half",
      },
      {
        image: img(
          "1600607686527-6fb886090705",
          "Kitchen with white counters and oak joinery",
        ),
        caption:
          "Kitchens run the full width of the plan. A single long window frames the courtyard from the sink.",
        layout: "pinned",
      },
      {
        image: img(
          "1600607688969-a5bfcd646154",
          "Villa exterior beneath a mature tree",
        ),
        layout: "full",
      },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    mapQuery: "Nettoor, Kochi, Kerala",
    distances: [
      { place: "Kundannoor Junction", distance: "2.1 km" },
      { place: "Lulu Mall, Edappally", distance: "9.4 km" },
      { place: "Infopark, Kakkanad", distance: "13 km" },
      { place: "Ernakulam South station", distance: "7.6 km" },
      { place: "Cochin International Airport", distance: "38 km" },
    ],
    catalogUrl: "/catalogs/nettoor-residences.pdf",
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

/** Slugs featured in the home page scrollytelling, in order. */
export const featuredSlugs = [
  "taqva-road-vaduthala",
  "mirzad-road",
  "1008",
  "nettoor-residences",
] as const;

export const featuredProjects = featuredSlugs
  .map((s) => getProject(s))
  .filter((p): p is Project => Boolean(p));

/** Card meta line: the year for dated projects, the status otherwise. */
export const projectEra = (p: Project) => (p.year ? String(p.year) : p.status);

export const statusFilters = [
  "All",
  "Ongoing",
  "Upcoming",
  "Completed",
] as const;

export const areaFilters = [
  "All",
  "Vaduthala",
  "Nettoor",
  "Perumbavoor",
  "Mirzad Road",
] as const;

export const stats = [
  { value: 6, label: "Projects delivered and underway" },
  { value: 40, suffix: "+", label: "Homes handed over" },
  { value: 10, label: "Years building in Kochi" },
  { value: 2, label: "Developments in progress" },
];
