"use client"; // Required for hooks in Next.js App Router

import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  // Don't show on home page
  if (pathname === "/") return null;
  return (
    <button
      onClick={() => router.back()}
      style={{
        padding: "8px 16px",
        background: "#0070f3",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      ← Back
    </button>
  );
}