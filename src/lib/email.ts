import nodemailer from "nodemailer";

interface ContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: ContactEmailParams) {
  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER || "muhammadamircs47@gmail.com";
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  // If credentials are not configured yet, log guidance and return gracefully
  if (!gmailUser || !gmailPass) {
    console.warn(
      "[EMAIL NOT SENT] GMAIL_USER or GMAIL_APP_PASSWORD not configured in .env. Message was saved to database for Admin Panel."
    );
    return { success: false, skipped: true, reason: "Email credentials not configured in .env" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass.replace(/\s+/g, ""),
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact Form" <${gmailUser}>`,
    to: toEmail,
    replyTo: email,
    subject: `📩 New Message from ${name} via Portfolio`,
    text: `You received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n(Tip: Hit Reply to respond directly to ${email})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 24px; text-align: center;">
          <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold;">✨ New Portfolio Inquiry</h2>
        </div>
        
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 80px; font-weight: 600;">From:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(email)}</a>
              </td>
            </tr>
          </table>

          <div style="background: #1e293b; padding: 18px; border-radius: 8px; border-left: 4px solid #06b6d4; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message Content:</p>
            <p style="margin: 0; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${escapeHtml(email)}" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reply directly to ${escapeHtml(name)}
            </a>
          </div>
        </div>

        <div style="background: #090d16; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
          Received on ${new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })} (PKT) • Portfolio Notification
        </div>
      </div>
    `,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
