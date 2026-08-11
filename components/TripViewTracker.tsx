"use client";

import { useEffect, useRef } from "react";

export function TripViewTracker({ tripId }: { tripId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    void fetch("/api/trips/metric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId, event: "views" }),
      keepalive: true,
    }).catch(() => {
      // Analytics must never block or break the trip experience.
    });
  }, [tripId]);

  return null;
}
