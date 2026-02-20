import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leepa_owners")
    .withIndex("leepa_by_unit_number")
    .order("asc")
    .collect();
  },
});

export const getUnitByUnitNumber = query({
  args: {unit_number: v.float64()},
  handler: async (ctx, args) => {
    const { unit_number } = args;
    return await ctx.db.query("leepa_owners")
    .filter(q => q.eq(q.field("unit_number"), unit_number))
    .collect();
  },
});

export const getMostRecentSales = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leepa_sales")
    .withIndex("leepa_sales_by_sale_date")
    .order("desc")
    .take(25);
  },
});

export const getSalesByUnitNumber = query({
  args: {unit_number: v.float64()},
  handler: async (ctx, args) => {
    const { unit_number } = args;
    return await ctx.db.query("leepa_sales")
    .filter(q => q.eq(q.field("unit_number"), unit_number))
    .order("desc")
    .take(25);
  },
});