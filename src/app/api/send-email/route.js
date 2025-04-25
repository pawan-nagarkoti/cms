import { sendMail } from "@/actions/mail-action";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { from, subject, text, html } = await request.json();
  try {
    const result = await sendMail({ from, subject, text, html });
    return NextResponse.json({ success: true, id: result.messageId, message: "OTP sended over the mail" }, { status: 200 });
  } catch (error) {
    console.error("Email send error:", error.message);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
