"use client";

import { Button } from "@/components/ui/button";
import { redirect, RedirectType } from "next/navigation";

interface AddToWatchlistButtonProps {
  symbol: string;
  userId: string | null;
}

export function AddToWatchlistButton({
  symbol,
  userId,
}: AddToWatchlistButtonProps) {
  const handleAddToWatchlist = () => {
    if (!userId) {
      return redirect("/handler/sign-in", RedirectType.replace);
    }
    // Placeholder function for you to play around with
    console.log(`Adding ${symbol} to watchlist for user:`, userId);

    // You can implement watchlist logic here:
    // - Store in localStorage
    // - Save to database using user.id
    // - Update global state
    // - Show toast notification

    alert(`${symbol} added to watchlist!`);
  };

  return (
    <Button
      onClick={handleAddToWatchlist}
      className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
    >
      Add to Watchlist
    </Button>
  );
}
