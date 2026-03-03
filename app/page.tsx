"use client"; 

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Home() {
  const [search_text, setSearchText] = useState("");
  const results = useQuery(api.leepa.getUnitByFullTextSearch, { search_text }) ?? [];
  const leepa = useQuery(api.leepa.getMostRecentSales);
  const buildings = useQuery(api.leepa.getAllBuildings) || [];
  const USDollar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

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
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Search Owners</h1>

      <input
        type="text"
        value={search_text}
        onChange={e => setSearchText(e.target.value)}
        placeholder="Search by name or unit…"
        className="border rounded px-3 py-2 w-full mb-4"
      />

      <div className="space-y-3">
        {results.map(r => (
          <div key={r._id} className="border p-3 rounded">
            <p><strong><Link href={`/unit/${r.property_unit_number}`}>{r.property_unit_number}</Link></strong></p>
            <p>{r.leepa_owner_name}</p>
            <p>{r.leepa_address_1}</p>
            <p>{r.leepa_address_2}</p>
            <p>{r.leepa_address_3}</p>
            <p>{r.leepa_address_4}</p>
            <p>{r.leepa_country}</p>
            <a href={`https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=${r.leepa_folio}`} target="_blank" rel="noopener noreferrer">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details on Leepa</button>
            </a>
          </div>
        ))}

        {search_text && results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>

      <div className="max-w-md text-xs leading-8 text-zinc-600 dark:text-zinc-400 xs:w-full">
        <table className="w-96" border={1} cellPadding="2" style={{ borderCollapse: "collapse" }}>
          <thead>
            
            <tr>
              <th className="w-1/4 text-left" onClick={() => requestSort("building_number")}>
                Building {sortConfig.key === "building_number" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="w-1/4 text-left" onClick={() => requestSort("association_number")}>
                Association {sortConfig.key === "association_number" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="w-1/2 text-center" onClick={() => requestSort("street_address")}>
                Address {sortConfig.key === "street_address" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
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
      <div className="max-w-lg text-xs leading-8 text-zinc-600 dark:text-zinc-400">
        <h1 className="text-2xl text-white font-semibold mb-4">Recent Sales</h1>
        <table className="w-96" border={1} cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            
            <tr>
              <th className="pr-4 text-left">Unit Number</th>
              <th className="pr-4 text-center">Sale Amount</th>
              <th className="pr-4 text-left">Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {leepa?.map(({ _id, unit_number, sale_amount, sale_date }) => 
            <tr key={_id}>
              <td className=""><Link href={`/unit/${unit_number}`}>{unit_number}</Link></td>
              <td className="text-right pr-15">{USDollar.format(sale_amount)}</td>
              <td className="">{sale_date.slice(0, -10)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          
          </p>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">

        </div>
      </main>
    </div>
  );
}
