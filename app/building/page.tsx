"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Page() {
    const buildings = useQuery(api.leepa.getAllBuildings) ?? [];
  // Types for buildings and sorting
  type Building = {
    _id: string;
    _creationTime: number;
    association_number: number;
    building_number: number;
    street_address: string;
  };

  type SortKey = "building_number" | "association_number" | "street_address";
  type SortConfig = { key: SortKey | null; direction: "asc" | "desc" };

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "building_number", direction: "asc" });

  // Sorting logic
  const sortedbuildings = useMemo(() => {
    const key = sortConfig.key;
    if (!key) return buildings as Building[];
    const dir = sortConfig.direction;
    return ([...buildings] as Building[]).sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return dir === "asc" ? -1 : 1;
      if (aVal > bVal) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [buildings, sortConfig]);

  // Handle column header click
  const requestSort = (key: SortKey | null) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <div className="max-w-lg text-sm leading-8 text-zinc-600 dark:text-zinc-400">
    <table border={1} cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        
        <tr>
          <th className="pr-4" onClick={() => requestSort("building_number")}>
            Building Number {sortConfig.key === "building_number" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="pr-4" onClick={() => requestSort("association_number")}>
            Association Number {sortConfig.key === "association_number" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="pr-4" onClick={() => requestSort("street_address")}>
            Street Address {sortConfig.key === "street_address" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedbuildings.map((p) => (
          
          <tr key={p._id}>
            
            <td><Link href={`/building/${p.building_number}`}>{p.building_number}</Link></td>
            <td><Link href={`/building/${p.building_number}`}>{p.association_number}</Link></td>
            <td><Link href={`/building/${p.building_number}`}>{p.street_address}</Link></td>

          </tr>
        ))}
      </tbody>
    </table>
      </div>
    
    </main>
    </div>
  );
}