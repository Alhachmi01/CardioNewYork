import { NextResponse } from "next/server";
import { getOgAdsVerification, isValidOgAdsSessionId } from "@/lib/ogadsStore";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!isValidOgAdsSessionId(sessionId)) {
    return NextResponse.json({ verified: false }, {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const conversion = await getOgAdsVerification(sessionId);
    return NextResponse.json({ verified: Boolean(conversion) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ verified: false }, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
