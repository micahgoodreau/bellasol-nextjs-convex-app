"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { use, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function Page({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
    const [open, setOpen] = useState(false)
    const { _id } = use(params) as { _id: Id<"contacts"> };
    const addEmailAddress = useMutation(api.contacts.addEmailAddress);
    const addPhoneNumber = useMutation(api.contacts.addPhoneNumber);
    const contact = useQuery(api.contacts.getContactById, { contactId: _id });
    const unitId = contact?.result?.unit || null;
    const [showEditForm, setShowEditForm] = useState(false);
    if (!contact) {
      return <div>Contact not found</div>;
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                        Contact Information
                    </h1>
                </div>
                <div className="text-black dark:text-zinc-50 text-left">
                    <p><strong>Name:</strong> {contact.result?.first_name} {contact.result?.last_name}</p>
                    <p><strong>Notes:</strong> {contact.result?.notes}</p>
                    <Card>
                        <CardTitle className="text-lg font-semibold mt-4">Email Addresses</CardTitle>

                    <CardContent>
                    <ul>
                        {contact.email_addresses?.map((email_address) => (
                            <li key={email_address._id}>
                                {email_address.email} ({email_address.type})
                            </li>
                        ))}
                    </ul>
                        <Collapsible open={open} onOpenChange={setOpen}>
                            <CollapsibleTrigger>
                            <Card className="w-full bg-gray-100 dark:bg-gray-800">
                                <CardContent className="flex items-center justify-between">
                                Add Email Address <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </CardContent>
                            </Card>

                            </CollapsibleTrigger>
                            <CollapsibleContent>
                            <Card className="w-full bg-gray-100 dark:bg-gray-800">
                                <CardContent>
                                    <form action={async (formData: FormData) => {
                                        const email = formData.get("email") as string;
                                        const type = formData.get("type") as string;
                                        await addEmailAddress({ email, type, contactId: _id });
                                    }}>
                                    <h2 className="text-lg font-semibold mt-4">Add Email Address</h2>
                                    <input type="email" name="email" placeholder="Email" required className="border rounded px-3 py-2 w-full mb-2" />
                                    <input type="text" name="type" placeholder="Type (e.g. Home, Work)" required className="border rounded px-3 py-2 w-full mb-2" />
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Add Email
                                    </button>
                                </form>
                                </CardContent>
                            </Card>
                            </CollapsibleContent>
                        </Collapsible>
                        </CardContent>
                    </Card>
                    <Card className="mt-4">
                        <CardTitle className="text-lg font-semibold">Phone Numbers</CardTitle>
                        <CardContent>
                    <form action={async (formData: FormData) => {
                        const number = formData.get("number") as string;
                        const type = formData.get("type") as string;
                        await addPhoneNumber({ number, type, contactId: _id });
                    }}>
                        <h2 className="text-lg font-semibold mt-4">Add Phone Number</h2>
                        <input type="tel" name="number" placeholder="Phone Number" required className="border rounded px-3 py-2 w-full mb-2" />
                        <input type="text" name="type" placeholder="Type (e.g. Home, Work)" required className="border rounded px-3 py-2 w-full mb-2" />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Phone Number
                        </button>
                    </form>

                    <p><strong>Phone Numbers:</strong></p>
                    <ul>
                        {contact.phone_numbers?.map((phone_number) => (
                            <li key={phone_number._id}>
                                {phone_number.number} ({phone_number.type})
                            </li>
                        ))}
                    </ul>
                        </CardContent>
                    </Card>

                </div>
                {unitId && (
                    <a href={`/unit/${unitId}`} className="text-blue-500 hover:underline">
                        View Unit {unitId} Details
                    </a>
                )}
                <button
                    onClick={() => setShowEditForm(true)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                    Edit Contact
                </button>
            </div>
        </main>
    </div>
  );
}