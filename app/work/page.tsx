import { redirect } from "next/navigation";

// /work was a placeholder that used to redirect back to the home overlay.
// Portfolio is now a real route at /portfolio — keep this redirect so old
// external links don't 404. Individual case studies like /work/menscare
// still resolve to their own pages under app/work/[slug]/.
export default function WorkPage() {
  redirect("/portfolio");
}
