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
    const result = unit[0];
    return {result, contacts: await getContactsByUnit(ctx, result._id)};
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
    email: v.string(),
    unit: v.id("units"),
  },
  handler: async (ctx, { first_name, last_name, email, unit }) => {
    await ctx.db.insert("contacts", { first_name, last_name, email, unit });
  },
});