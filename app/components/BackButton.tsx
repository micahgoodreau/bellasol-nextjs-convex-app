"use client"; // Required for hooks in Next.js App Router

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  // Don't show on home page
  if (pathname === "/") return ( <div>Bellasol Condo Info</div> );
  return (
    <Button
      onClick={() => router.back()}
        variant="outline"
    >
      ← Back
    </Button>
  );
}