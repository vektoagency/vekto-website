/**
 * Hero background videos — edit this list to control which clips appear
 * in the mobile hero rotating grid. Order matters (top-to-bottom across
 * the 2 scrolling columns).
 *
 * To swap a clip: replace one ID below with one from the full clip list.
 * Get IDs by running: node -e "const d = require('./app/data/bunny-clips.json'); d.clips.forEach(c => console.log(c.brand, '—', c.category, '—', c.id))"
 *
 * Available clips (as of last sync):
 *   1.  DUSQ              | Cinematic    | 7d0a3c1c-a36f-4591-a5a5-cb9e167b80f0
 *   2.  PARFEN            | Cinematic    | 8c0bba5b-5949-43f4-9e09-d5308ad27dce
 *   3.  MEN'S CARE        | Organic      | 46817022-ef22-4bdb-92ba-f964c29a3100
 *   4.  GIFTO.BG          | Organic      | bc858219-3397-4952-b4ac-d40a7cff6898
 *   5.  MEN'S CARE        | UGC          | 07be6d30-0764-4cd1-bac5-23f2cfecd853
 *   6.  VEKTO LAB         | Experimental | 06b550bb-c1c9-4b4c-b7d3-ae031d6d920a
 *   7.  VEKTO LAB         | Experimental | 90c23113-982a-4059-9fba-1883ca1ce36f
 *   8.  PARFEN            | Cinematic    | d6037e1a-3c55-4a06-b209-0114cdb445be
 *   9.  ISOSPORT          | Cinematic    | a57d4f6d-f0a3-426a-884f-3d4f63ec24b9
 *  10.  KRISTA G          | UGC          | 5dafff47-541e-4186-b202-9e7ec94f5e4a
 *  11.  ISTINSKIMED.BG    | Cinematic    | 1b972963-4de6-4c87-95be-b74b2ce8a26e
 *  12.  BANSKO ESTATES    | Cinematic    | e486e5a9-ae0c-407d-aa5f-eac6f6d96c29
 *  13.  MEN'S CARE        | Experimental | fac1abe2-96c5-4b91-a552-c45f7dad51f1
 */
export const heroFeaturedClipIds: string[] = [
  "7d0a3c1c-a36f-4591-a5a5-cb9e167b80f0", // DUSQ — Cinematic
  "8c0bba5b-5949-43f4-9e09-d5308ad27dce", // PARFEN — Cinematic
  "a57d4f6d-f0a3-426a-884f-3d4f63ec24b9", // ISOSPORT — Cinematic
  "1b972963-4de6-4c87-95be-b74b2ce8a26e", // ISTINSKIMED.BG — Cinematic
  "e486e5a9-ae0c-407d-aa5f-eac6f6d96c29", // BANSKO ESTATES — Cinematic
  "d6037e1a-3c55-4a06-b209-0114cdb445be", // PARFEN — Cinematic
];
