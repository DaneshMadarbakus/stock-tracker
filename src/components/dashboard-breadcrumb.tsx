"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "/overview": "Overview",
  "/search": "Search Stocks", 
  "/watchlist": "My Watchlist",
  "/settings": "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  
  const currentPageLabel = routeLabels[pathname] || "Dashboard";
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/overview" className="text-muted-foreground">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathname !== "/overview" && (
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