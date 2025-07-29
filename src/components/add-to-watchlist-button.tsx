"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect, RedirectType } from "next/navigation";
import { addSymbolToUserWatchlist, removeSymbolFromUserWatchList } from "@/actions/watchlist";

interface AddToWatchlistButtonProps {
  symbol: string;
  userId: string | null;
  initialIsInWatchlist?: boolean;
}

export function AddToWatchlistButton({
  symbol,
  userId,
  initialIsInWatchlist = false,
}: AddToWatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleWatchlist = async () => {
    if (!userId) {
      return redirect("/handler/sign-in", RedirectType.replace);
    }

    try {
      setIsLoading(true);
      
      if (isInWatchlist) {
        const result = await removeSymbolFromUserWatchList(symbol);
        if (result.success) {
          setIsInWatchlist(false);
        }
      } else {
        const result = await addSymbolToUserWatchlist(symbol);
        if (result.success) {
          setIsInWatchlist(true);
        }
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleWatchlist}
      disabled={isLoading}
      className={`shrink-0 ${
        isInWatchlist
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-accent text-accent-foreground hover:bg-accent/90"
      }`}
    >
      {isLoading 
        ? "Loading..."
        : isInWatchlist 
          ? "Added to Watchlist" 
          : "Add to Watchlist"
      }
    </Button>
  );
}
