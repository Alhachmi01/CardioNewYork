import { NextResponse } from "next/server";
import { isValidOgAdsSessionId, registerOgAdsSession } from "@/lib/ogadsStore";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: string };
    if (!isValidOgAdsSessionId(body.sessionId)) {
      return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 400 });
    }

    await registerOgAdsSession(body.sessionId);
    return NextResponse.json({ ok: true }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "registration_failed" }, { status: 500 });
  }
}
