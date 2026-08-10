import { NextResponse } from "next/server";
import { isValidOgAdsSessionId, verifyOgAdsSession } from "@/lib/ogadsStore";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("aff_sub");

  if (!isValidOgAdsSessionId(sessionId)) {
    return new NextResponse("INVALID", { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const verified = await verifyOgAdsSession(sessionId, {
      offerId: url.searchParams.get("offer_id") || undefined,
      payout: url.searchParams.get("payout") || undefined,
      ran: url.searchParams.get("ran") || undefined,
      sessionIp: url.searchParams.get("session_ip") || undefined,
      convertedAt: Date.now(),
    });

    return new NextResponse(verified ? "OK" : "UNKNOWN_SESSION", {
      status: verified ? 200 : 404,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse("ERROR", { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
