
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
