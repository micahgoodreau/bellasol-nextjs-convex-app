"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SearchPage() {
  const [search_text, setSearchText] = useState("");

  const results = useQuery(api.leepa.getUnitByFullTextSearch, { search_text }) ?? [];

  return (
    <div className="p-6 max-w-xl mx-auto">
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
            <p><strong>Unit {r.property_unit_number}</strong></p>
            <p>{r.leepa_owner_name}</p>
            <p>{r.leepa_address_1}</p>
            <p>{r.leepa_address_2}</p>
            <p>{r.leepa_address_3}</p>
            <p>{r.leepa_address_4}</p>
            <p>{r.leepa_country}</p>
          </div>
        ))}

        {search_text && results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
