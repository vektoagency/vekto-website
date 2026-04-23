import { redirect } from "next/navigation";

// The portfolio now lives inside the Mac-128K hero overlay (reel wall opens
// on screen click). Keep /work as a permanent redirect so external links
// don't land on a stale duplicate. Individual case studies like
// /work/menscare still resolve to their own pages.
export default function WorkPage() {
  redirect("/");
}
