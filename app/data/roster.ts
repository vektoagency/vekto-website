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
  { name: "MEN'S CARE",    region: "BG", logo: "/images/roster-trim/logo-menscare.png"     },
  { name: "DUSQ",          region: "US", logo: "/images/roster-trim/logo-dusq.png"        },
  { name: "PARFEN",        region: "BG", logo: "/images/roster-trim/logo-parfen.png"      },
  { name: "ISOSPORT",      region: "BG", logo: "/images/roster-trim/logo-isosport.png"    },
  { name: "BULTEX",        region: "BG", logo: "/images/roster-trim/logo-bultex.png"       },
  { name: "NEDELYA",       region: "BG", logo: "/images/logo-nedelya.svg"      },
  { name: "ANOMALY",       region: "US", logo: "/images/roster-trim/logo-anomaly.png"     },
  { name: "GOURMET HOUSE", region: "BG", logo: "/images/roster-trim/logo-gourmethouse.png" },
  { name: "ETHAN'S",       region: "US", logo: "/images/roster-trim/logo-ethans.png"      },
  { name: "LUCKY ENERGY",  region: "US", logo: "/images/roster-trim/logo-lucky.png"       },
  { name: "NUTRIFITT",     region: "US", logo: "/images/roster-trim/logo-nutrifitt.png"   },
  { name: "beMe",          region: "BG", logo: "/images/roster-trim/logo-bemeacne.png"    },
  { name: "BULMAG",        region: "BG", logo: "/images/roster-trim/logo-bulmag.png" },
  { name: "TASTE FLAVOR",  region: "US", logo: "/images/roster-trim/logo-tasteflavor.png" },
  { name: "EVENTLINK",     region: "BG", logo: "/images/roster-trim/logo-eventlink.png" },
  { name: "PHYTOLIFE",     region: "BG", logo: "/images/roster-trim/logo-phytolife.png"   },
  { name: "GIFTO",         region: "BG", logo: "/images/roster-trim/logo-adventuresbg.png" },
  { name: "ADVENTURES BG", region: "BG", logo: "/images/roster-trim/logo-gifto2.png"      },
  { name: "ALPEN PHARMA",  region: "BG", logo: "/images/roster-trim/logo-alpenpharma.png"  },
  { name: "NIDO",          region: "BG", logo: "/images/roster-trim/logo-nido2.png" },
  { name: "ARTE HOTEL",    region: "BG", logo: "/images/roster-trim/logo-artehotel.png", invert: true },
  { name: "KASHMIR HOTEL", region: "BG", logo: "/images/roster-trim/logo-kashmirhotel.png" },
  { name: "CARTEL CAFFE",  region: "BG", logo: "/images/logo-cartelcaffe.svg", invert: true },
  { name: "CODEFASHION",   region: "BG", logo: "/images/roster-trim/logo-codefashion.png" },
];
