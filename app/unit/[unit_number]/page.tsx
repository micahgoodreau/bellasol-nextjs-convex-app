"use client";
import AddContactForm from "@/app/components/AddContactForm";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { use, useState } from 'react'
 
export default function Page({
  params,
}: {
  params: Promise<{ unit_number: string }>;
}) {
  const { unit_number } = use(params);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const unitInfo = useQuery(api.units.getUnitByUnitNumber, { unit_number: parseFloat(unit_number) });
  const leepa_owner = useQuery(api.leepa.getLeepaOwnersByUnitNumber, { unit_number: parseFloat(unit_number) });
  const leepa_sales = useQuery(api.leepa.getSalesByUnitNumber, { unit_number: parseFloat(unit_number) });
  const unit = useQuery(api.units.getUnitByNumber, { unit_number: parseFloat(unit_number) });
  const USDollar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Unit {unit_number} Information Page
            </h1>
            {unit && (
              <button
                onClick={() => setShowAddContactForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Contact
              </button>
            )}
          </div>
          <div className="mt-4">
            {leepa_owner?.map(({ 
              _id,
              owner_name,
              address_1,
              address_2,
              address_3,
              address_4,
              folio,
              country}) => 
            
            <div className="text-black dark:text-zinc-50 text-left" key={_id}>
              <p className="text-xl">Leepa Owner Information</p>
              <p>{owner_name}</p>
              <p>{address_1}</p>
              <p>{address_2}</p>
              <p>{address_3}</p>
              <p>{address_4}</p>
              <p>{country}</p>
              <a href={`https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=${folio}`} target="_blank" rel="noopener noreferrer">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details on Leepa</button>
              </a>
              
              </div>)}

          {unitInfo && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Unit Details</h2>
              <p className="text-sm text-gray-600">Unit Number: {unitInfo.result.unit_number}</p>
              <p className="mt-4 text-sm text-gray-500">Unit ID: {unitInfo.result._id}</p>
              <p className="mt-1 text-sm text-gray-500">Association Number: {unitInfo.result.association_number}</p>
            </div>
          )}
          {unitInfo && unitInfo?.contacts?.length ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Contacts</h2>
              <ul className="list-disc list-inside">
                {unitInfo.contacts.map((contact) => (
                  <li key={contact._id} className="text-sm text-gray-600">
                    <Link href={`/contact/${contact._id}`}>
                      {contact.first_name} {contact.last_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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

      {showAddContactForm && unit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-md w-full mx-4">
            <button
              onClick={() => setShowAddContactForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
            <div className="p-6">
              <AddContactForm unitId={unit._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
