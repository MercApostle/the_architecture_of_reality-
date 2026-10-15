import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { ok: false, error: "Please enter a message of at least 5 characters." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "jeremyashe@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "The Architecture of Reality <onboarding@resend.dev>";

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          replyTo: email,
          subject: `[Architecture of Reality] ${subject || "Direct Inquiry"} — ${name || email}`,
          html: `
            <div style="background-color: #090b0e; color: #f2f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #222936;">
              <div style="border-bottom: 1px solid #222936; padding-bottom: 16px; margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 11px; letter-spacing: 0.2em; color: #d4af37; text-transform: uppercase;">Direct Transmission</span>
                <h2 style="margin: 8px 0 0 0; font-size: 20px; color: #f2f4f8; font-weight: 600;">The Architecture of Reality</h2>
              </div>

              <div style="background-color: #11151c; border: 1px solid #222936; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #8c97a8;">
                  <strong style="color: #f2f4f8;">Sender Name:</strong> ${name ? escapeHtml(name) : "Not specified"}
                </p>
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #8c97a8;">
                  <strong style="color: #f2f4f8;">Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #d4af37; text-decoration: none;">${escapeHtml(email)}</a>
                </p>
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #8c97a8;">
                  <strong style="color: #f2f4f8;">Inquiry Topic:</strong> ${escapeHtml(subject || "General Inquiry")}
                </p>
                <p style="margin: 0; font-size: 13px; color: #8c97a8;">
                  <strong style="color: #f2f4f8;">Received:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/Vancouver" })} (PT)
                </p>
              </div>

              <div style="margin-bottom: 28px;">
                <h3 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #d4af37; margin: 0 0 12px 0;">Message Content</h3>
                <div style="background-color: #050608; border-left: 3px solid #d4af37; padding: 16px 20px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #f2f4f8; white-space: pre-wrap;">${escapeHtml(message)}</div>
              </div>

              <div style="border-top: 1px solid #222936; padding-top: 16px; font-size: 12px; color: #8c97a8;">
                <p style="margin: 0;">Direct Reply: You can reply directly to this email notification to reach <strong>${escapeHtml(email)}</strong>.</p>
              </div>
            </div>
          `,
          text: `New Direct Inquiry from The Architecture of Reality\n\nFrom: ${name || "Anonymous"} (${email})\nTopic: ${subject || "General Inquiry"}\nDate: ${new Date().toISOString()}\n\nMessage:\n${message}\n\n(Direct Reply: Simply reply to this email to reach ${email})`,
        });

        if (error) {
          console.error("[Resend Error]", error);
          // Still log details for audit trail
          console.log("[Contact Submission Fallback]", { name, email, subject, message });
        } else {
          console.log("[Resend Email Sent Successfully]", { id: data?.id, to: recipientEmail });
        }
      } catch (emailErr) {
        console.error("[Resend Exception]", emailErr);
        console.log("[Contact Submission Fallback]", { name, email, subject, message });
      }
    } else {
      // In development or prior to adding RESEND_API_KEY in Vercel
      console.log("[Contact Submission Received (RESEND_API_KEY not set)]", {
        name: name || "Anonymous",
        email,
        subject: subject || "General Inquiry",
        message,
        recipientEmail,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Your message has been received. Jeremy will be in touch shortly.",
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}

