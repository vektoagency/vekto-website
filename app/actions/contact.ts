"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const message = formData.get("message") as string;

  // All five fields are required at the form layer (HTML5 required + JS
  // disable on the submit button). This server-side check is the second
  // line of defence for clients that bypass client-side validation.
  if (!name || !email || !phone || !company || !message) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await resend.emails.send({
      from: "VEKTO Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `New inquiry from ${name} (${company})`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}
