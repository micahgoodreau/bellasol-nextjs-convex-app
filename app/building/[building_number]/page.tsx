"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: Promise<{ building_number: string }>;
}) {
  const { building_number } = use(params);
  const results = useQuery(api.leepa.getUnitsByBuildingNumber, { property_building_number: parseFloat(building_number) }) ?? [];
  

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Building {building_number} Owners</h1>



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

        {results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
