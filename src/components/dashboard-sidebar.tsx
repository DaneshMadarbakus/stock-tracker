"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Star, Settings, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Stocks",
    url: "/stocks",
    icon: BarChart3,
  },
  {
    title: "My Watchlist",
    url: "/watchlist",
    icon: Star,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
        <Link
          href="/stocks"
          className="flex items-center space-x-2 group"
          onClick={handleLinkClick}
        >
          <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <span className="font-bold text-lg text-primary">StockTracker</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/80 font-medium mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`
                      w-full rounded-lg transition-all duration-200
                      ${
                        pathname === item.url
                          ? "bg-accent/10 text-accent border-accent/20 border shadow-sm"
                          : "hover:bg-accent/5 hover:text-accent/80"
                      }
                    `}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center space-x-3 p-3"
                      onClick={handleLinkClick}
                    >
                      <item.icon
                        className={`h-4 w-4 ${
                          pathname === item.url
                            ? "text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 bg-muted/20">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 StockTracker
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
