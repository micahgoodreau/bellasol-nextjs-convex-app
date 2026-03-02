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
export const getAllBuildings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("buildings")
    .withIndex("by_building_number")
    .order("asc")
    .collect();
  },
});
export const getUnitByUnitNumber = query({
  args: {property_unit_number: v.float64()},
  handler: async (ctx, args) => {
    const { property_unit_number } = args;
    return await ctx.db.query("leepa_owners")
    .filter(q => q.eq(q.field("property_unit_number"), property_unit_number))
    .collect();
  },
});
export const getUnitsByBuildingNumber = query({
  args: {property_building_number: v.float64()},
  handler: async (ctx, args) => {
    const { property_building_number } = args;
    return await ctx.db.query("leepa_owners")
    .filter(q => q.eq(q.field("property_building_number"), property_building_number))
    .collect();
  },
});
export const getUnitByFullTextSearch = query({
  args: {search_text: v.string()},
  handler: async (ctx, args) => {
    const { search_text } = args;
    return await ctx.db.query("leepa_owners")
    .withSearchIndex("leepa_owner_full_text_search", (q) => q.search("full_text", search_text))
  .take(20)
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
    .withIndex("leepa_sales_by_unit_number", (q) => q.eq("unit_number", unit_number))
    //.filter(q => q.eq(q.field("unit_number"), unit_number))
    .take(25);
  },
});