"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

type AddContactFormProps = {
  unitId: Id<"units">;
};

export default function AddContactForm({ unitId }: AddContactFormProps) {
  const addContact = useMutation(api.units.addContact);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName || !lastName || !email) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      await addContact({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        unit: unitId,
      });
      setStatus("Contact added successfully.");
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (error) {
      setStatus("Failed to add contact. Please try again.");
      console.error("addContact failed", error);
    }
  };

  return (
    <div className="mt-8 rounded-lg border p-4 bg-white text-black shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Add Contact</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">First name</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-black"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-black"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-black"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit">Add Contact</Button>

        {status && <p className="text-sm text-gray-600 dark:text-gray-300">{status}</p>}
      </form>
    </div>
  );
}