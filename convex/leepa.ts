import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leepa")
    .withIndex("leepa_by_unit_number")
    .order("asc")
    .collect();
  },
});