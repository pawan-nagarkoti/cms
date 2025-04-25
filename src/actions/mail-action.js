import nodemailer from "nodemailer";

export async function sendMail({ from, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from,
    to: '"pawansingh6313@gmail.com"',
    subject,
    text,
    html,
  });

  return info;
}
