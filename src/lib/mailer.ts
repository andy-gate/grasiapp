import nodemailer from "nodemailer";
import { getCompanySettings } from "@/lib/company";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Kirim notifikasi email saat ada pesan kontak baru.
 * Tidak melempar error — kegagalan kirim email tidak boleh
 * menggagalkan penyimpanan pesan.
 */
export async function sendContactNotification(payload: ContactPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } =
    process.env;
  if (!SMTP_HOST) return;

  try {
    const company = await getCompanySettings();
    const to = CONTACT_TO_EMAIL || company.email;
    if (!to) return;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });

    await transporter.sendMail({
      from: SMTP_USER ?? to,
      to,
      replyTo: payload.email,
      subject: `[GrasiApp] Pesan baru dari ${payload.name}`,
      html: `
        <h2>Pesan kontak baru</h2>
        <p><strong>Nama:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        ${payload.phone ? `<p><strong>Telepon:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
        <p><strong>Bahasa:</strong> ${payload.locale}</p>
        <p><strong>Pesan:</strong></p>
        <p style="white-space:pre-line">${escapeHtml(payload.message)}</p>
      `,
    });
  } catch (error) {
    console.error("Gagal mengirim notifikasi email kontak:", error);
  }
}
