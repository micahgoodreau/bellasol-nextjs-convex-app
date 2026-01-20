import { query } from "./_generated/server";

export const getAllUnits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("units")
    .withIndex("by_unit_number")
    .order("asc")
    .collect();
  },
});