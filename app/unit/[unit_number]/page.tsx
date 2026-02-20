"use client";
import { v } from "convex/values";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { use } from 'react'
 
export default function Page({
  params,
}: {
  params: Promise<{ unit_number: string }>;
}) {
  const { unit_number } = use(params);
  const leepa_owner = useQuery(api.leepa.getUnitByUnitNumber, { unit_number: parseFloat(unit_number) });
  const leepa_sales = useQuery(api.leepa.getSalesByUnitNumber, { unit_number: parseFloat(unit_number) });
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Unit {unit_number} Information Page
          </h1>
          <div className="mt-4">
            {leepa_owner?.map(({ 
              _id,
              owner_name,
              address1,
              address2,
              address3,
              address4,
              country }) => 
            
            <div className="text-zinc-200" key={_id}>
              <p className="text-xl">Leepa Owner Information</p>
              <p>{owner_name}</p>
              <p>{address1}</p>
              <p>{address2}</p>
              <p>{address3}</p>
              <p>{address4}</p>
              <p>{country}</p>
              
              </div>)}
          <p className="mt-6 text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Recent Sales
          </p>
            {leepa_sales?.map(({
              _id,
              sale_date,
              sale_amount }) => (
              <div className="text-zinc-200" key={_id}>
                <p>Sale Date: {sale_date.slice(0, -10)}  Sale Price: {sale_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              </div>
            ))}
          </div>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Test Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
