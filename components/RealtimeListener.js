"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    // Subscribe to any Insert, Update, or Delete on the products table
    const channel = supabase
      .channel("storefront-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" }, // <-- Now it listens to everything!
        (payload) => {
          console.log("Database changed! Refreshing storefront in background...", payload);
          // This tells Next.js to silently re-run server components and fetch the latest data
          router.refresh(); 
        }
      )
      .subscribe();

    // Cleanup the subscription when the user leaves the page
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // This component doesn't render any UI, it just listens in the background
  return null; 
}