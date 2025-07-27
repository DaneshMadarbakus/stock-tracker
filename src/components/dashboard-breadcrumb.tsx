"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "/stocks": "Stocks",
  "/watchlist": "My Watchlist",
  "/settings": "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  
  // Handle dynamic stock routes
  const stockMatch = pathname.match(/^\/stocks\/([A-Z]+)$/);
  if (stockMatch) {
    const symbol = stockMatch[1];
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/stocks" className="text-muted-foreground">
              Stocks
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">
              {symbol}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  
  const currentPageLabel = routeLabels[pathname] || "Dashboard";
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/stocks" className="text-muted-foreground">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathname !== "/stocks" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {currentPageLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}