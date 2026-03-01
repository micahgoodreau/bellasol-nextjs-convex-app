"use client"; 

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function Home() {
  const leepa = useQuery(api.leepa.getMostRecentSales);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Leepa Most Recent Sales
          </h1>
    <table border={1} cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        
        <tr>
            <th className="w-1/4 p-2">Unit</th>
            <th className="w-1/4 p-2">Amount</th>
            <th className="w-1/2 p-2">Date</th>
        </tr>
        </thead>
        <tbody>
         {leepa?.map(({ _id, unit_number, sale_amount, sale_date }) => 
            <tr key={_id}>
              <td><Link href={`/unit/${unit_number}`}>{unit_number}</Link></td>
              <td>{sale_amount}</td>
              <td>{sale_date.slice(0, -10)}</td>
            </tr>)}
        </tbody>
    </table>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row"> 
          
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">

        </div>
      </main>
    </div>
  );
}
