import nodemailer from 'nodemailer';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oppalert.vercel.app";

// Reusable transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Sends a confirmation email to a user who just registered for an event.
 */
export async function sendRegistrationEmail(toEmail: string, userName: string, eventTitle: string, eventSlug: string) {
  // If credentials aren't set, log and skip (useful for local dev without env vars)
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Email credentials not set. Skipping registration email to:", toEmail);
    return;
  }

  const eventUrl = `${APP_URL}/events/${eventSlug}`;

  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #080A07; color: #EDE8DF; padding: 40px; border-radius: 20px; border: 1px solid #252D22;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #E8A020; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">OppAlert</h1>
      </div>
      
      <h2 style="font-size: 20px; color: #EDE8DF; margin-bottom: 20px;">Registration Confirmed! 🎉</h2>
      
      <p style="color: #9A9C8E; line-height: 1.6; font-size: 16px;">
        Hi ${userName},
      </p>
      
      <p style="color: #9A9C8E; line-height: 1.6; font-size: 16px;">
        You have successfully secured your spot for <strong>${eventTitle}</strong>.
      </p>

      <div style="background-color: #141710; border: 1px solid #252D22; padding: 20px; border-radius: 12px; margin: 30px 0; text-align: center;">
        <p style="color: #555C50; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Event Details</p>
        <p style="color: #EDE8DF; font-weight: bold; margin-bottom: 0;">${eventTitle}</p>
      </div>

      <p style="color: #9A9C8E; line-height: 1.6; font-size: 16px;">
        Keep this email for your records. The organizer will reach out with further instructions and links closer to the event date.
      </p>
      
      <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
        <a href="${eventUrl}" style="background-color: #E8A020; color: #080A07; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
          View Event Page
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #252D22; margin: 40px 0 20px;" />
      
      <div style="text-align: center; color: #555C50; font-size: 12px;">
        <p>This email was sent from OppAlert because you registered for an event.</p>
        <p>© ${new Date().getFullYear()} OppAlert. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"OppAlert Events" <${process.env.GMAIL_EMAIL}>`,
      to: toEmail,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: htmlContent,
    });
    console.log(`Registration email sent to ${toEmail}`);
  } catch (error) {
    console.error("Failed to send registration email:", error);
  }
}

/**
 * Sends an email to an organizer with their event management link.
 */
export async function sendOrganizerEventCreatedEmail(toEmail: string, eventTitle: string, eventSlug: string) {
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Email credentials not set. Skipping organizer creation email to:", toEmail);
    return;
  }

  const eventUrl = `${APP_URL}/events/${eventSlug}`;
  const manageUrl = `${APP_URL}/organizer`;

  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #080A07; color: #EDE8DF; padding: 40px; border-radius: 20px; border: 1px solid #252D22;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #E8A020; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">OppAlert Organizer</h1>
      </div>
      
      <h2 style="font-size: 20px; color: #EDE8DF; margin-bottom: 20px;">Your Event is Live! 🚀</h2>
      
      <p style="color: #9A9C8E; line-height: 1.6; font-size: 16px;">
        You have successfully created <strong>${eventTitle}</strong>.
      </p>

      <div style="background-color: #141710; border: 1px solid #252D22; padding: 20px; border-radius: 12px; margin: 30px 0; text-align: center;">
        <p style="color: #555C50; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Registration Link (Share this with your audience)</p>
        <p style="color: #E8A020; font-weight: bold; margin-bottom: 0;">${eventUrl}</p>
      </div>

      <p style="color: #9A9C8E; line-height: 1.6; font-size: 16px;">
        You can track registrations, manage attendees, and export your attendee list directly from your dashboard.
      </p>
      
      <div style="text-align: center; margin-top: 40px; margin-bottom: 20px; display: flex; gap: 10px; justify-content: center;">
        <a href="${eventUrl}" style="background-color: #1C2119; color: #EDE8DF; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; border: 1px solid #252D22;">
          View Public Page
        </a>
        <a href="${manageUrl}" style="background-color: #E8A020; color: #080A07; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
          Manage Attendees
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #252D22; margin: 40px 0 20px;" />
      
      <div style="text-align: center; color: #555C50; font-size: 12px;">
        <p>This email was sent to notify you of a successful event creation on OppAlert.</p>
        <p>© ${new Date().getFullYear()} OppAlert. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"OppAlert Organizer" <${process.env.GMAIL_EMAIL}>`,
      to: toEmail,
      subject: `Event Live: ${eventTitle}`,
      html: htmlContent,
    });
    console.log(`Organizer creation email sent to ${toEmail}`);
  } catch (error) {
    console.error("Failed to send organizer creation email:", error);
  }
}

