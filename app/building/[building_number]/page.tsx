"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";

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
            <p><strong>Unit {r.property_unit_number}</strong></p>
            <p>{r.leepa_owner_name}</p>
            <p>{r.leepa_address_1}</p>
            <p>{r.leepa_address_2}</p>
            <p>{r.leepa_address_3}</p>
            <p>{r.leepa_address_4}</p>
            <p>{r.leepa_country}</p>
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
