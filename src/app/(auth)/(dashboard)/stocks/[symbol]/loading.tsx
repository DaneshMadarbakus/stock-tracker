import { BackButton } from "@/components/back-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "@/components/chart-skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <BackButton />

        <div className="flex justify-between items-start gap-4">
          <div>
            <Skeleton className="h-9 w-24 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Live Price Skeleton */}
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-5 w-8" />
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Skeleton */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-7 w-48 mb-2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg bg-card">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border rounded-lg bg-card">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <ChartSkeleton />
      </div>
    </div>
  );
}