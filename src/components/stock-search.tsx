"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStockSearch } from "@/hooks/use-stock-search";

export function StockSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: results, isLoading, hasResults } = useStockSearch(query);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when we have results
  useEffect(() => {
    if (hasResults && query.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [hasResults, query.length]);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, Apple)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 py-3"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="p-3 text-sm text-muted-foreground">
              Searching...
            </div>
          )}
          
          {!isLoading && results.length === 0 && query.length >= 2 && (
            <div className="p-3 text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          )}
          
          {!isLoading && results.length > 0 && (
            <div className="py-1">
              {results.slice(0, 8).map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stocks/${stock.symbol}`}
                  className="block w-full px-3 py-2 text-left hover:bg-accent/10 transition-colors flex items-center gap-3"
                >
                  <div className="p-1 rounded bg-accent/10">
                    <TrendingUp className="h-3 w-3 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {stock.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}