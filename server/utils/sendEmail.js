import nodemailer from "nodemailer";

let transporter;

// Lazily built so a missing SMTP config doesn't crash the whole app at boot —
// it'll only throw when someone actually tries to send an email.
const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587/25
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Sends an email. Usage: sendEmail({ to, subject, html, text })
 */
export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || `"QorZen Technologies" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  await sendEmail({
    to,
    subject: "Reset your QorZen password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Password reset request</h2>
        <p>Hi ${name || "there"},</p>
        <p>We received a request to reset the password for your QorZen account. This link is valid for 30 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#1c1917;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
        <p style="color:#78716c;font-size:12px;">If the button doesn't work, copy this link into your browser:<br/>${resetUrl}</p>
      </div>
    `,
    text: `Reset your QorZen password using this link (valid 30 minutes): ${resetUrl}`,
  });
};

export const sendPasswordChangedEmail = async ({ to, name }) => {
  await sendEmail({
    to,
    subject: "Your QorZen password was changed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <p>Hi ${name || "there"},</p>
        <p>This is a confirmation that the password on your QorZen account was just changed.</p>
        <p>If this wasn't you, please contact support immediately.</p>
      </div>
    `,
    text: `Your QorZen account password was just changed. If this wasn't you, contact support immediately.`,
  });
};

// Every enquiry / contact form submission on the site gets forwarded here so
// the team sees it as a normal email, in addition to it being saved in the DB.
const CONTACT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || "qorzentechnologies@gmail.com";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendContactNotificationEmail = async ({ name, email, phone, subject, service, message }) => {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Subject / Lead Category", subject],
    ["Service / Area of Interest", service],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 12px;color:#78716c;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:6px 12px;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  await sendEmail({
    to: CONTACT_NOTIFY_EMAIL,
    subject: `New Enquiry: ${subject || "General Inquiry"} — ${name}`,
    replyTo: email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
        <h2>New enquiry from the website</h2>
        <table style="border-collapse:collapse;width:100%;">${rows}</table>
        <p style="margin-top:20px;"><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;background:#f5f5f4;padding:12px;border-radius:6px;">${escapeHtml(message)}</p>
      </div>
    `,
    text: [
      "New enquiry from the website",
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      subject && `Subject: ${subject}`,
      service && `Service: ${service}`,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
};

export const sendWelcomeEmail = async ({ to, name }) => {
  await sendEmail({
    to,
    subject: "Welcome to QorZen!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to QorZen, ${name || "there"}!</h2>
        <p>Your account (${to}) has been created successfully. You're all set to start exploring courses and trainings.</p>
        <p>If you didn't create this account, please contact support.</p>
      </div>
    `,
    text: `Welcome to QorZen, ${name || "there"}! Your account (${to}) has been created successfully.`,
  });
};
