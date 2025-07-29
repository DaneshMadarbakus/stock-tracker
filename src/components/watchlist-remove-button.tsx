"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeSymbolFromUserWatchList } from "@/actions/watchlist";

interface WatchlistRemoveButtonProps {
  symbol: string;
}

export function WatchlistRemoveButton({ symbol }: WatchlistRemoveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      const result = await removeSymbolFromUserWatchList(symbol);

      if (result.success) {
        setIsRemoved(true);
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRemoved) {
    return null; // Hide the button after successful removal
  }

  return (
    <Button
      onClick={handleRemove}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Remove from watchlist</span>
    </Button>
  );
}
