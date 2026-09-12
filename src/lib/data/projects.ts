import { img, type ImageRef } from "../images";

export type ProjectStatus = "Completed" | "Ongoing" | "Upcoming";
export type Area = "Nettoor" | "Vaduthala";
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

export interface Project {
  slug: string;
  name: string;
  location: string;
  area: Area;
  status: ProjectStatus;
  units: number;
  unitTypes: string;
  plotArea: string;
  builtUp: string;
  completion: string;
  summary: string;
  cover: ImageRef;
  portrait: ImageRef;
  overview: string[];
  gallery: GalleryItem[];
  floorPlans: { ground: FloorPlan; first: FloorPlan };
  specs: { category: string; items: string[] }[];
  pricing: Record<TierKey, string>;
  tierImages: Record<TierKey, ImageRef>;
  mapQuery: string;
  distances: { place: string; distance: string }[];
  /** PDF under /public. Absent → "Request the catalogue" WhatsApp path. */
  catalogUrl?: string;
}

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

export const comparisonRows: { feature: string; tiers: [boolean, boolean, boolean] }[] =
  [
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

const defaultSpecs = (variant: "villa" | "apartment") => [
  {
    category: "Structure and construction",
    items: [
      "RCC framed structure designed for Kochi's seismic zone III",
      "Solid cement block masonry, 8\" external, 6\" internal",
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
  label: "Lower Level",
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
    { name: "Stair", dims: "10' × 8'", x: 52, y: 40, w: 16, h: 34 },
    { name: "Store", dims: "6' × 5'", x: 38, y: 68, w: 14, h: 10 },
    { name: "Deck", dims: "24' × 8'", x: 4, y: 78, w: 92, h: 18 },
  ],
};

const apartmentFirst: FloorPlan = {
  label: "Upper Level",
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

export const projects: Project[] = [
  {
    slug: "nettoor-residences",
    name: "Nettoor Residences",
    location: "Nettoor, Kochi",
    area: "Nettoor",
    status: "Completed",
    units: 12,
    unitTypes: "3 and 4 bedroom villas",
    plotArea: "42 cents",
    builtUp: "1,850 – 2,400 sq ft",
    completion: "March 2024",
    summary:
      "Twelve villas set around a shared courtyard, a short walk from the Nettoor backwater.",
    cover: img("1600566753190-17f0baa2a6c3", "Nettoor Residences: timber-clad villa elevation at dusk"),
    portrait: img("1600573472592-401b489a3cdc", "Nettoor Residences: courtyard and pool between villas"),
    overview: [
      "Nettoor sits on the quieter edge of Kochi, where the road narrows and the coconut palms begin to outnumber the buildings. The site is a former paddy holding, long and low, with the backwater a few hundred metres to the west. We kept the length and used it: twelve villas in two rows, a planted courtyard between them, and every living room opening onto that green.",
      "The houses share a family of materials: laterite at the base, lime-washed masonry above, and a sloped clay-tile roof that throws deep shade over the verandas. Inside, engineered teak runs through the bedrooms and a single long window in each kitchen looks over the courtyard. Nothing is decorative for its own sake.",
      "All twelve homes were handed over in the spring of 2024. Nine were taken fully furnished, with interiors drawn by the same team that drew the houses.",
    ],
    gallery: [
      {
        image: img("1600585153490-76fb20a32601", "Living room opening to the courtyard garden"),
        caption: "Living rooms open fully to the courtyard. The roof overhang keeps the monsoon out and the light in.",
        layout: "full",
      },
      {
        image: img("1600566753051-f0b89df2dd90", "Bedroom with timber floor and floor-to-ceiling glazing"),
        layout: "half",
      },
      {
        image: img("1600607687920-4e2a09cf159d", "Dining room with timber table beside the garden"),
        layout: "half",
      },
      {
        image: img("1600607686527-6fb886090705", "Kitchen with white counters and oak joinery"),
        caption: "Kitchens run the full width of the plan. A single long window frames the courtyard from the sink.",
        layout: "pinned",
      },
      {
        image: img("1600607688066-890987f18a86", "Bathroom with marble vanity"),
        layout: "half",
      },
      {
        image: img("1600607688969-a5bfcd646154", "Villa exterior under a mature tree"),
        layout: "half",
      },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    pricing: { unfurnished: "₹1.45 Cr", semi: "₹1.62 Cr", fully: "₹1.85 Cr" },
    tierImages: tierImages,
    mapQuery: "Nettoor, Kochi, Kerala",
    distances: [
      { place: "Kundannoor Junction", distance: "2.1 km" },
      { place: "Lulu Mall, Edappally", distance: "9.4 km" },
      { place: "Infopark, Kakkanad", distance: "13 km" },
      { place: "Cochin International Airport", distance: "38 km" },
      { place: "Ernakulam South station", distance: "7.6 km" },
    ],
    catalogUrl: "/catalogs/nettoor-residences.pdf",
  },
  {
    slug: "vaduthala-project-one",
    name: "Vaduthala Project One",
    location: "Vaduthala, Kochi",
    area: "Vaduthala",
    status: "Completed",
    units: 8,
    unitTypes: "3 bedroom duplex apartments",
    plotArea: "18 cents",
    builtUp: "1,640 – 1,920 sq ft",
    completion: "November 2022",
    summary:
      "Eight duplex homes on a corner plot, stepped back to keep the old mango tree.",
    cover: img("1613490493576-7fde63acd811", "Vaduthala Project One: white rendered elevation with pool"),
    portrait: img("1600566752355-35792bedcfea", "Vaduthala Project One: bathroom detail"),
    overview: [
      "Our first building in Vaduthala, on a corner plot two streets back from the main road. A mango tree stood at the centre of the site and we chose to build around it. The block steps back on its upper floors so the canopy sits over the entrance court rather than being cut for it.",
      "Eight duplexes, each with its own front door from the court and a double-height living room on the lower level. The upper floor holds the bedrooms and a small terrace garden. White render, black steel and teak: a limited palette that has weathered well through two monsoons.",
      "Handed over in late 2022. The owners' association has since planted the roof terrace, which was not in our drawings but is very much in the spirit of them.",
    ],
    gallery: [
      {
        image: img("1600566753086-00f18fb6b3ea", "Double-height living room with timber floor"),
        caption: "Living rooms are double height on the lower level, with the bedroom corridor above looking down into them.",
        layout: "full",
      },
      { image: img("1600607687644-c7171b42498f", "Bedroom with linen and garden view"), layout: "half" },
      { image: img("1600585152220-90363fe7e115", "Kitchen with island and pendant lights"), layout: "half" },
      {
        image: img("1600210491892-03d54c0aaf87", "Living room with arched windows"),
        caption: "The upper-floor terraces take the evening breeze from the west; the arches soften the afternoon sun.",
        layout: "pinned",
      },
      { image: img("1600596542815-ffad4c1539a9", "White villa elevation and pool"), layout: "full" },
    ],
    floorPlans: { ground: apartmentGround, first: apartmentFirst },
    specs: defaultSpecs("apartment"),
    pricing: { unfurnished: "₹1.20 Cr", semi: "₹1.35 Cr", fully: "₹1.55 Cr" },
    tierImages: tierImages,
    mapQuery: "Vaduthala, Kochi, Kerala",
    distances: [
      { place: "Vaduthala Junction", distance: "0.8 km" },
      { place: "Ernakulam North station", distance: "4.2 km" },
      { place: "Lulu Mall, Edappally", distance: "5.1 km" },
      { place: "Infopark, Kakkanad", distance: "12 km" },
      { place: "Cochin International Airport", distance: "27 km" },
    ],
  },
  {
    slug: "vaduthala-project-two",
    name: "Vaduthala Project Two",
    location: "Vaduthala, Kochi",
    area: "Vaduthala",
    status: "Ongoing",
    units: 10,
    unitTypes: "3 and 4 bedroom villas",
    plotArea: "36 cents",
    builtUp: "2,050 – 2,600 sq ft",
    completion: "Expected December 2026",
    summary:
      "Ten villas on a sloping site, roofs stepped down toward the canal.",
    cover: img("1600585154363-67eb9e2e2099", "Vaduthala Project Two: black timber villa under a large tree at dusk"),
    portrait: img("1600585154526-990dced4db0d", "Vaduthala Project Two: villa elevation at night"),
    overview: [
      "The site falls three metres from the road to a canal at its southern edge. Rather than level it, the plan follows the slope: ten villas in three terraces, each row's roof stepping down so the one behind keeps its view of the water.",
      "The material story is darker here than at Nettoor. Charred timber cladding, black steel and polished concrete floors, with the warmth coming from the light rather than the palette. Every villa has a west-facing veranda for the evening and a small, shaded court for the afternoon.",
      "Structure is complete on all ten homes. Finishing is under way on the first terrace, and we expect to hand over in December 2026. Three homes remain available.",
    ],
    gallery: [
      {
        image: img("1600573472591-ee6b68d14c68", "Living room with polished concrete floor and rocking chair"),
        caption: "Polished concrete floors carry the light from the courtyard deep into the plan.",
        layout: "full",
      },
      { image: img("1600607687126-8a3414349a51", "Bedroom with grey linen and morning light"), layout: "half" },
      { image: img("1600585154084-4e5fe7c39198", "Black clad villa at night with lit windows"), layout: "half" },
      {
        image: img("1600607687939-ce8a6c25118c", "Living room with timber ceiling and garden view"),
        caption: "Timber ceilings run outside to the veranda, so the room reads as one space in the evening.",
        layout: "pinned",
      },
      { image: img("1600585154526-990dced4db0d", "Villa elevation at dusk"), layout: "full" },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    pricing: { unfurnished: "₹1.38 Cr", semi: "₹1.54 Cr", fully: "₹1.76 Cr" },
    tierImages: tierImages,
    mapQuery: "Vaduthala, Kochi, Kerala",
    distances: [
      { place: "Vaduthala Junction", distance: "1.2 km" },
      { place: "Ernakulam North station", distance: "4.8 km" },
      { place: "Lulu Mall, Edappally", distance: "5.6 km" },
      { place: "Infopark, Kakkanad", distance: "12.5 km" },
      { place: "Cochin International Airport", distance: "27 km" },
    ],
  },
  {
    slug: "vaduthala-project-three",
    name: "Vaduthala Project Three",
    location: "Vaduthala, Kochi",
    area: "Vaduthala",
    status: "Upcoming",
    units: 6,
    unitTypes: "4 bedroom villas",
    plotArea: "28 cents",
    builtUp: "2,400 – 2,900 sq ft",
    completion: "Launching early 2027",
    summary:
      "Six larger villas on a lane of old houses, drawn to keep the street's scale.",
    cover: img("1600047509807-ba8f99d2cdde", "Vaduthala Project Three: brick and timber villa study"),
    portrait: img("1600563438938-a9a27216b4f5", "Vaduthala Project Three: white elevation study"),
    overview: [
      "A lane of older houses, most of them single storey with deep verandas and tiled roofs. The brief we set ourselves was to add six homes without changing how the lane feels to walk down.",
      "The villas keep to two storeys, with the upper floor pulled back from the street behind a planted terrace. Brick, lime plaster and timber. Larger plans than our earlier projects, each with a study and a separate guest suite on the ground floor.",
      "Drawings are with the planning authority. We expect to open the register in early 2027. If you would like to be told first, leave your number and we will call before anything is published.",
    ],
    gallery: [
      { image: img("1600047509358-9dc75507daeb", "Brick and timber elevation study"), layout: "full" },
      { image: img("1600210492486-724fe5c67fb0", "Living room study with gallery wall"), layout: "half" },
      { image: img("1600489000022-c2086d79f9d4", "Kitchen study in deep green"), layout: "half" },
    ],
    floorPlans: { ground: villaGround, first: villaFirst },
    specs: defaultSpecs("villa"),
    pricing: { unfurnished: "From ₹1.60 Cr", semi: "From ₹1.78 Cr", fully: "From ₹2.02 Cr" },
    tierImages: tierImages,
    mapQuery: "Vaduthala, Kochi, Kerala",
    distances: [
      { place: "Vaduthala Junction", distance: "1.5 km" },
      { place: "Ernakulam North station", distance: "5.1 km" },
      { place: "Lulu Mall, Edappally", distance: "5.9 km" },
      { place: "Infopark, Kakkanad", distance: "13 km" },
      { place: "Cochin International Airport", distance: "26 km" },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const stats = [
  { value: 6, label: "Projects delivered" },
  { value: 48, label: "Homes handed over" },
  { value: 12, label: "Years building in Kochi" },
  { value: 2, label: "Ongoing developments" },
];
