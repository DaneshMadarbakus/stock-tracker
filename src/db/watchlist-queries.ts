import { db } from "./index";
import { watchlist } from "./schema";
import { eq, and, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// Get all watchlist items for a user
export async function getUserWatchlist(userId: string) {
  return await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(desc(watchlist.createdAt));
}

// Check if a specific symbol is in user's watchlist
export async function getSymbolFromWatchlist(userId: string, symbol: string) {
  const result = await db
    .select()
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.symbol, symbol.toUpperCase())
      )
    )
    .limit(1);

  return result.length > 0;
}

// Add a symbol to user's watchlist
export async function createWatchListRecord(userId: string, symbol: string) {
  const [result] = await db
    .insert(watchlist)
    .values({
      userId,
      symbol: symbol.toUpperCase(),
    })
    .returning();

  return result;
}

// Remove a symbol from user's watchlist
export async function deleteWatchListRecord(userId: string, symbol: string) {
  return await db
    .delete(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.symbol, symbol.toUpperCase())
      )
    );
}

// Cached version of getUserWatchlist with user-specific tags
export const getCachedUserWatchlist = (userId: string) =>
  unstable_cache(
    (id: string) => getUserWatchlist(id),
    [`user-watchlist-${userId}`],
    {
      tags: [`watchlist-${userId}`],
    }
  )(userId);

// Cached version of getSymbolFromWatchlist with symbol-specific tags
export const getCachedSymbolFromWatchlist = (userId: string, symbol: string) =>
  unstable_cache(
    (id: string, sym: string) => getSymbolFromWatchlist(id, sym),
    [`symbol-watchlist-${userId}-${symbol}`],
    {
      tags: [`watchlist-${userId}-${symbol}`],
    }
  )(userId, symbol);
