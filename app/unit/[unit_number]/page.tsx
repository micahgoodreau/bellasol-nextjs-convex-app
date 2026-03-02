"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { use } from 'react'
 
export default function Page({
  params,
}: {
  params: Promise<{ unit_number: string }>;
}) {
  const { unit_number } = use(params);
  const leepa_owner = useQuery(api.leepa.getUnitByUnitNumber, { property_unit_number: parseFloat(unit_number) });
  const leepa_sales = useQuery(api.leepa.getSalesByUnitNumber, { unit_number: parseFloat(unit_number) });
  const USDollar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Unit {unit_number} Information Page
          </h1>
          <div className="mt-4">
            {leepa_owner?.map(({ 
              _id,
              leepa_owner_name,
              leepa_address_1,
              leepa_address_2,
              leepa_address_3,
              leepa_address_4,
              leepa_folio,
              leepa_country}) => 
            
            <div className="text-zinc-200" key={_id}>
              <p className="text-xl">Leepa Owner Information</p>
              <p>{leepa_owner_name}</p>
              <p>{leepa_address_1}</p>
              <p>{leepa_address_2}</p>
              <p>{leepa_address_3}</p>
              <p>{leepa_address_4}</p>
              <p>{leepa_country}</p>
              <a href={`https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=${leepa_folio}`} target="_blank" rel="noopener noreferrer">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details on Leepa</button>
              </a>
              
              </div>)}
          <p className="mt-6 text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Recent Sales
          </p>
          <table border={1} cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            
            <tr>

              <th className="pr-4">Sale Amount</th>
              <th className="pr-4">Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {leepa_sales?.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()).map(({
              _id,
              sale_date,
              sale_amount }) => (
            <tr key={_id}>
              <td className="text-right pr-5">{USDollar.format(sale_amount)}</td>
              <td className="">{sale_date.slice(0, -10)}</td>
            </tr>))}
            </tbody>
          </table>

          </div>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">

        </div>
      </main>
    </div>
  );
}
