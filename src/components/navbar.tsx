"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <div className="flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg md:text-xl text-primary">StockTracker</span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex flex-1 items-center justify-end">
          {/* Dashboard Button - visible on all screen sizes */}
          <Button asChild>
            <Link href="/overview">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
