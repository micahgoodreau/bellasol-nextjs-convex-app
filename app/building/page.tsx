"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function Page() {
    const buildings = useQuery(api.leepa.getAllBuildings) ?? [];
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                To get started, edit the page.tsx file.
            </h1>
            {buildings.map(({ _id, building_number }) => (
                <div className="mt-4" key={_id}>
                    <Link href={`/building/${building_number}`} className="text-blue-500 hover:underline">
                        Building {building_number}
                    </Link>
                </div>
            ))}

        </div>
    </main>
    </div>
  );
}