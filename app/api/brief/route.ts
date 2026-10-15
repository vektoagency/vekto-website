import { NextResponse } from "next/server";
import { submitBrief, type BriefSubmission } from "../../actions/brief";

// The brief posts here instead of calling the server action directly.
// A server action is addressed by an id that changes on every deploy, so a
// visitor who opened the brief before a deploy and pressed Send after it
// hit "Failed to find Server Action" and lost the submission (15 Oct 2026).
// This URL never changes between deploys.
export async function POST(req: Request) {
  let data: BriefSubmission;
  try {
    data = (await req.json()) as BriefSubmission;
  } catch {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }
  try {
    const res = await submitBrief(data);
    return NextResponse.json(res, { status: res.success ? 200 : 502 });
  } catch (err) {
    console.error("[brief] api route threw", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
