"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

type Contact = {
  _id: Id<"contacts">;
  first_name: string;
  last_name: string;
  notes: string;
  unit: Id<"units">;
};

type AddContactFormProps = {
  unitId: Id<"units">;
  contact?: Contact;
  onSuccess?: () => void;
};

export default function AddContactForm({ unitId, contact, onSuccess }: AddContactFormProps) {
  const addContact = useMutation(api.units.addContact);
  const updateContact = useMutation(api.units.updateContact);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const isEditing = !!contact;

  useEffect(() => {
    if (contact) {
      setFirstName(contact.first_name);
      setLastName(contact.last_name);
      setNotes(contact.notes);
    }
  }, [contact]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName || !lastName || !notes) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      if (isEditing && contact) {
        await updateContact({
          contactId: contact._id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          notes: notes.trim(),
        });
        setStatus("Contact updated successfully.");
      } else {
        await addContact({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          notes: notes.trim(),
          unit: unitId,
        });
        setStatus("Contact added successfully.");
        setFirstName("");
        setLastName("");
        setNotes("");
      }
      onSuccess?.();
    } catch (error) {
      const action = isEditing ? "update" : "add";
      setStatus(`Failed to ${action} contact. Please try again.`);
      console.error(`${action}Contact failed`, error);
    }
  };

  return (
    <div className="mt-8 rounded-lg border p-4 bg-white text-black shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">
        {isEditing ? "Edit Contact" : "Add Contact"}
      </h2>
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
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 text-black"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button type="submit">
          {isEditing ? "Update Contact" : "Add Contact"}
        </Button>

        {status && <p className="text-sm text-gray-600 dark:text-gray-300">{status}</p>}
      </form>
    </div>
  );
}