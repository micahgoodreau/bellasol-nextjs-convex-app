
import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";






export const getContactById = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, { contactId }) => {
    const result = await ctx.db.get(contactId);
    return {
      result,
      email_addresses: await getEmailAddresses(ctx, contactId),
      phone_numbers: await getPhoneNumbers(ctx, contactId)
    };
  },
});

async function getEmailAddresses(ctx: QueryCtx, contactId: Id<"contacts"> | null) {
    if (contactId === null) {
        return null;
    }
    return await ctx.db.query("email_addresses")
        .withIndex("by_contact", (q) => q.eq("contact", contactId))
        .collect();
}

async function getPhoneNumbers(ctx: QueryCtx, contactId: Id<"contacts"> | null) {
    if (contactId === null) {
        return null;
    }
    return await ctx.db.query("phone_numbers")
        .withIndex("by_contact", (q) => q.eq("contact", contactId))
        .collect();
}

export const addEmailAddress = mutation({
    args: {
        email: v.string(),
        contactId: v.id("contacts"),
        type: v.string()
    },
    handler: async (ctx, { email, contactId, type }) => {
        const email_address = await ctx.db.insert("email_addresses", { email, contact: contactId, type });
        return email_address;
    }
});

export const addPhoneNumber = mutation({
    args: {
        number: v.string(),
        contactId: v.id("contacts"),
        type: v.string()
    },
    handler: async (ctx, { number, contactId, type }) => {
        const phone_number = await ctx.db.insert("phone_numbers", { number, contact: contactId, type });
        return phone_number;
    }
});

export const updateEmailAddress = mutation({
    args: {
        emailId: v.id("email_addresses"),
        email: v.string(),
        type: v.string()
    },
    handler: async (ctx, { emailId, email, type }) => {
        await ctx.db.patch(emailId, { email, type });
    }
});

export const deleteEmailAddress = mutation({
    args: {
        emailId: v.id("email_addresses")
    },
    handler: async (ctx, { emailId }) => {
        await ctx.db.delete(emailId);
    }
});

export const updatePhoneNumber = mutation({
    args: {
        phoneId: v.id("phone_numbers"),
        number: v.string(),
        type: v.string()
    },
    handler: async (ctx, { phoneId, number, type }) => {
        await ctx.db.patch(phoneId, { number, type });
    }
});

export const deletePhoneNumber = mutation({
    args: {
        phoneId: v.id("phone_numbers")
    },
    handler: async (ctx, { phoneId }) => {
        await ctx.db.delete(phoneId);
    }
});

export const updateContact = mutation({
    args: {
        contactId: v.id("contacts"),
        first_name: v.string(),
        last_name: v.string(),
        notes: v.string()
    },
    handler: async (ctx, { contactId, first_name, last_name, notes }) => {
        await ctx.db.patch(contactId, { first_name, last_name, notes });
    }
});

export const deleteContact = mutation({
    args: {
        contactId: v.id("contacts")
    },
    handler: async (ctx, { contactId }) => {
        // Delete all email addresses associated with this contact
        const emails = await ctx.db.query("email_addresses")
            .withIndex("by_contact", (q) => q.eq("contact", contactId))
            .collect();
        for (const email of emails) {
            await ctx.db.delete(email._id);
        }
        
        // Delete all phone numbers associated with this contact
        const phones = await ctx.db.query("phone_numbers")
            .withIndex("by_contact", (q) => q.eq("contact", contactId))
            .collect();
        for (const phone of phones) {
            await ctx.db.delete(phone._id);
        }
        
        // Delete the contact itself
        await ctx.db.delete(contactId);
    }
});
