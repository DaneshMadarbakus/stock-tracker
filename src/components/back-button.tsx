"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();
  
  return (
    <Button 
      variant="ghost"
      onClick={() => router.back()}
      className="text-muted-foreground hover:text-muted-foreground hover:bg-transparent mb-4 group p-0 h-auto justify-start"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}