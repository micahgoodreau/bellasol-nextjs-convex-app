import { Id } from "./_generated/dataModel";
import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const getAllUnits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("units")
      .withIndex("by_unit_number")
      .order("asc")
      .collect();
  },
});

export const getUnitByNumber = query({
  args: { unit_number: v.float64() },
  handler: async (ctx, { unit_number }) => {
    const results = await ctx.db.query("units")
      .withIndex("by_unit_number")
      .filter((q) => q.eq(q.field("unit_number"), unit_number))
      .collect();
    return results.length > 0 ? results[0] : null;
  },
});
export const getUnitByUnitNumber = query({
  args: {unit_number: v.float64()},
  handler: async (ctx, args) => {
    const { unit_number } = args;
    const unit = await ctx.db.query("units")
    .filter(q => q.eq(q.field("unit_number"), unit_number))
    .collect();
    if (unit.length == 0) {
      return null;
    }
    const contacts = await getContactsByUnit(ctx, unit[0]._id);
    if (!contacts) {
      return { result: unit[0], contacts: [] };
    }
    const contactsWithDetails = [];
    for (const contact of contacts) {
      const email_addresses = await ctx.db.query("email_addresses")
        .withIndex("by_contact", (q) => q.eq("contact", contact._id))
        .collect();
      const phone_numbers = await ctx.db.query("phone_numbers")
        .withIndex("by_contact", (q) => q.eq("contact", contact._id))
        .collect();
      contactsWithDetails.push({
        ...contact,
        email_addresses,
        phone_numbers,
      });
    }
    const result = unit[0];
    return {result, contacts: contactsWithDetails};
  },
});

async function getContactsByUnit(ctx: QueryCtx, unitId: Id<"units"> | null) {
  if (unitId === null) {
    return null;
  }
  return (await ctx.db.query("contacts")
    .withIndex("by_unit", (q) => q.eq("unit", unitId))
    .collect());
}
export const addContact = mutation({
  args: {
    first_name: v.string(),
    last_name: v.string(),
    notes: v.string(),
    unit: v.id("units"),
  },
  handler: async (ctx, { first_name, last_name, notes, unit }) => {
    await ctx.db.insert("contacts", { first_name, last_name, notes, unit });
  },
});

export const updateContact = mutation({
  args: {
    contactId: v.id("contacts"),
    first_name: v.string(),
    last_name: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, { contactId, first_name, last_name, notes }) => {
    await ctx.db.patch(contactId, { first_name, last_name, notes });
  },
});