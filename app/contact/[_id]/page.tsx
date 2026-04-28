"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { use, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronDownIcon, PencilIcon, Trash2Icon } from "lucide-react";
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
    const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
    const [editEmail, setEditEmail] = useState("");
    const [editEmailType, setEditEmailType] = useState("");
    const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
    const [editPhone, setEditPhone] = useState("");
    const [editPhoneType, setEditPhoneType] = useState("");
    const { _id } = use(params) as { _id: Id<"contacts"> };
    const addEmailAddress = useMutation(api.contacts.addEmailAddress);
    const addPhoneNumber = useMutation(api.contacts.addPhoneNumber);
    const updateEmailAddress = useMutation(api.contacts.updateEmailAddress);
    const deleteEmailAddress = useMutation(api.contacts.deleteEmailAddress);
    const updatePhoneNumber = useMutation(api.contacts.updatePhoneNumber);
    const deletePhoneNumber = useMutation(api.contacts.deletePhoneNumber);
    const contact = useQuery(api.contacts.getContactById, { contactId: _id });
    const unitId = contact?.result?.unit || null;
    const [showEditForm, setShowEditForm] = useState(false);
    
    const handleEditEmailClick = (emailId: string, email: string, type: string) => {
        setEditingEmailId(emailId);
        setEditEmail(email);
        setEditEmailType(type);
    };

    const handleSaveEmail = async () => {
        if (!editEmail || !editEmailType) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            await updateEmailAddress({
                emailId: editingEmailId as Id<"email_addresses">,
                email: editEmail,
                type: editEmailType,
            });
            setEditingEmailId(null);
            setEditEmail("");
            setEditEmailType("");
        } catch (error) {
            console.error("Failed to update email address:", error);
        }
    };

    const handleDeleteEmail = async (emailId: string, email: string) => {
        if (confirm(`Are you sure you want to delete ${email}?`)) {
            try {
                await deleteEmailAddress({
                    emailId: emailId as Id<"email_addresses"> 
                });
            } catch (error) {
                console.error("Failed to delete email address:", error);
                alert("Failed to delete email address. Please try again.");
            }
        }
    };

    const handleEditPhoneClick = (phoneId: string, number: string, type: string) => {
        setEditingPhoneId(phoneId);
        setEditPhone(number);
        setEditPhoneType(type);
    };

    const handleSavePhone = async () => {
        if (!editPhone || !editPhoneType) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            await updatePhoneNumber({
                phoneId: editingPhoneId as Id<"phone_numbers">,
                number: editPhone,
                type: editPhoneType,
            });
            setEditingPhoneId(null);
            setEditPhone("");
            setEditPhoneType("");
        } catch (error) {
            console.error("Failed to update phone number:", error);
        }
    };

    const handleDeletePhone = async (phoneId: string, number: string) => {
        if (confirm(`Are you sure you want to delete ${number}?`)) {
            try {
                await deletePhoneNumber({
                    phoneId: phoneId as Id<"phone_numbers">
                });
            } catch (error) {
                console.error("Failed to delete phone number:", error);
                alert("Failed to delete phone number. Please try again.");
            }
        }
    };

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
                                {editingEmailId === email_address._id ? (
                                    <div className="flex flex-col gap-2 my-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            placeholder="Email"
                                            className="border rounded px-3 py-2 text-white"
                                        />
                                        <input
                                            type="text"
                                            value={editEmailType}
                                            onChange={(e) => setEditEmailType(e.target.value)}
                                            placeholder="Type (e.g. Home, Work)"
                                            className="border rounded px-3 py-2 text-white"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEmail}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingEmailId(null)}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between py-2">
                                        <span>{email_address.email} ({email_address.type})</span>
                                        <div className="flex items-center gap-2 ml-4">
                                            <PencilIcon
                                                className="h-4 w-4 cursor-pointer hover:text-blue-500"
                                                onClick={() =>
                                                    handleEditEmailClick(
                                                        email_address._id,
                                                        email_address.email,
                                                        email_address.type
                                                    )
                                                }
                                            />
                                            <Trash2Icon
                                                className="h-4 w-4 cursor-pointer hover:text-red-500"
                                                onClick={() =>
                                                    handleDeleteEmail(
                                                        email_address._id,
                                                        email_address.email
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
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
                                {editingPhoneId === phone_number._id ? (
                                    <div className="flex flex-col gap-2 my-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                        <input
                                            type="tel"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            placeholder="Phone Number"
                                            className="border rounded px-3 py-2 text-white"
                                        />
                                        <input
                                            type="text"
                                            value={editPhoneType}
                                            onChange={(e) => setEditPhoneType(e.target.value)}
                                            placeholder="Type (e.g. Home, Work)"
                                            className="border rounded px-3 py-2 text-white"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSavePhone}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingPhoneId(null)}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between py-2">
                                        <span>{phone_number.number} ({phone_number.type})</span>
                                        <div className="flex items-center gap-2 ml-4">
                                            <PencilIcon
                                                className="h-4 w-4 cursor-pointer hover:text-blue-500"
                                                onClick={() =>
                                                    handleEditPhoneClick(
                                                        phone_number._id,
                                                        phone_number.number,
                                                        phone_number.type
                                                    )
                                                }
                                            />
                                            <Trash2Icon
                                                className="h-4 w-4 cursor-pointer hover:text-red-500"
                                                onClick={() =>
                                                    handleDeletePhone(
                                                        phone_number._id,
                                                        phone_number.number
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
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