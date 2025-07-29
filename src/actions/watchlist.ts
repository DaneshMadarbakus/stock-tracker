"use server";

import { revalidateTag } from "next/cache";
import { stackServerApp } from "@/stack";
import {
  getCachedUserWatchlist,
  getCachedSymbolFromWatchlist,
  createWatchListRecord,
  deleteWatchListRecord,
} from "@/db/watchlist-queries";

export async function addSymbolToUserWatchlist(symbol: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to add to watchlist",
      };
    }

    const watchlistRecord = await createWatchListRecord(user.id, symbol);

    // Invalidate both the user's watchlist cache and the specific symbol cache
    revalidateTag(`watchlist-${user.id}`);
    revalidateTag(`watchlist-${user.id}-${symbol}`);

    return {
      success: true,
      recordId: watchlistRecord.id,
    };
  } catch (e) {
    console.error("Error adding symbol to watchlist:", e);
    return {
      success: false,
      error: "Failed to add to watchlist. Please try again.",
    };
  }
}

export async function removeSymbolFromUserWatchList(symbol: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to delete from watchlist",
      };
    }

    await deleteWatchListRecord(user.id, symbol);

    // Invalidate both the user's watchlist cache and the specific symbol cache
    revalidateTag(`watchlist-${user.id}`);
    revalidateTag(`watchlist-${user.id}-${symbol}`);

    return {
      success: true,
    };
  } catch (e) {
    console.error("Error deleting symbol from watchlist:", e);

    return {
      success: false,
      error: "Failed to remove from watchlist. Please try again.",
    };
  }
}

export async function getUserWatchlistAction() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to get your watchlist",
      };
    }

    const userWatchlist = await getCachedUserWatchlist(user.id);

    return {
      success: true,
      data: userWatchlist,
    };
  } catch (e) {
    console.error("Error reading watchlist:", e);

    return {
      success: false,
      error: "Failed to find watchlist. Please try again.",
    };
  }
}

export async function isSymbolInWatchlist(symbol: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to check if it is in your watchlist",
      };
    }

    const isInWatchlist = await getCachedSymbolFromWatchlist(user.id, symbol);

    return {
      success: true,
      isInWatchlist,
    };
  } catch (e) {
    console.error("Error reading watchlist:", e);

    return {
      success: false,
      error: "Failed to find watchlist. Please try again.",
    };
  }
}
