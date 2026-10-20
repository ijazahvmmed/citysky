// Set this public value when a custom domain is connected to the deployment.
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cityskyhomes.com").origin;

export const site = {
  name: "Citysky Builders",
  shortName: "Citysky",
  tagline: "Homes built to belong.",
  description:
    "Citysky Builders is a Kochi-based property developer designing and building considered homes in Nettoor and Vaduthala, Kerala.",
  url: siteUrl,
  domain: new URL(siteUrl).host,
  phone: "+91 73067 91919",
  phoneHref: "tel:+917306791919",
  whatsappNumber: "917306791919",
  email: "cityskyhomes@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/KxJBkaBbWskFjQR9A",
  address: {
    line1: "Citysky Builders",
    line2: "Vaduthala, Kochi",
    line3: "Kerala 682023, India",
  },
  rera: "K-RERA/PRJ/ERN/000000",
  hours: "Monday to Saturday, 9.30am – 6pm",
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Build With Citysky", href: "/build-with-citysky" },
    { label: "Studio", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
