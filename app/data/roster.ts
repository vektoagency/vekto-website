// The client roster — one list, shared by the homepage wall and the /cv
// presentation page so the two can never drift apart. Real brands with
// real logo files only; `invert` flags dark-ink marks that need flipping
// on a jet tile, `dark` flips the whole tile to jet for white-native art.
export type Client = {
  name: string;
  region: "BG" | "US";
  logo: string;
  invert?: boolean;
  dark?: boolean;
};

export const ROSTER: Client[] = [
  { name: "MEN'S CARE",    region: "BG", logo: "/images/roster-web/logo-menscare.webp"     },
  { name: "DUSQ",          region: "US", logo: "/images/roster-web/logo-dusq.webp"        },
  { name: "PARFEN",        region: "BG", logo: "/images/roster-web/logo-parfen.webp"      },
  { name: "ISOSPORT",      region: "BG", logo: "/images/roster-web/logo-isosport.webp"    },
  { name: "BULTEX",        region: "BG", logo: "/images/roster-web/logo-bultex.webp"       },
  { name: "NEDELYA",       region: "BG", logo: "/images/logo-nedelya.svg"      },
  { name: "ANOMALY",       region: "US", logo: "/images/roster-web/logo-anomaly.webp"     },
  { name: "GOURMET HOUSE", region: "BG", logo: "/images/roster-web/logo-gourmethouse.webp" },
  { name: "ETHAN'S",       region: "US", logo: "/images/roster-web/logo-ethans.webp"      },
  { name: "LUCKY ENERGY",  region: "US", logo: "/images/roster-web/logo-lucky.webp"       },
  { name: "NUTRIFITT",     region: "US", logo: "/images/roster-web/logo-nutrifitt.webp"   },
  { name: "beMe",          region: "BG", logo: "/images/roster-web/logo-bemeacne.webp"    },
  { name: "BULMAG",        region: "BG", logo: "/images/roster-web/logo-bulmag.webp" },
  { name: "TASTE FLAVOR",  region: "US", logo: "/images/roster-web/logo-tasteflavor.webp" },
  { name: "EVENTLINK",     region: "BG", logo: "/images/roster-web/logo-eventlink.webp" },
  { name: "PHYTOLIFE",     region: "BG", logo: "/images/roster-web/logo-phytolife.webp"   },
  { name: "GIFTO",         region: "BG", logo: "/images/roster-web/logo-adventuresbg.webp" },
  { name: "ADVENTURES BG", region: "BG", logo: "/images/roster-web/logo-gifto2.webp"      },
  { name: "ALPEN PHARMA",  region: "BG", logo: "/images/roster-web/logo-alpenpharma.webp"  },
  { name: "NIDO",          region: "BG", logo: "/images/roster-web/logo-nido2.webp" },
  { name: "ARTE HOTEL",    region: "BG", logo: "/images/roster-web/logo-artehotel.webp", invert: true },
  { name: "KASHMIR HOTEL", region: "BG", logo: "/images/roster-web/logo-kashmirhotel.webp" },
  { name: "CARTEL CAFFE",  region: "BG", logo: "/images/logo-cartelcaffe.svg", invert: true },
  { name: "CODEFASHION",   region: "BG", logo: "/images/roster-web/logo-codefashion.webp" },
];
