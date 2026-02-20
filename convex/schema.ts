import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  units: defineTable({
    association_number: v.float64(),
    building_number: v.float64(),
    city: v.string(),
    folio: v.string(),
    state: v.string(),
    strap: v.string(),
    street_address_1: v.string(),
    street_address_2: v.string(),
    unit_number: v.float64(),
    zip: v.string(),
  }).index("by_unit_number", ["unit_number"]),
  leepa_owners: defineTable({
    address1: v.string(),
    address2: v.string(),
    address3: v.string(),
    address4: v.string(),
    country: v.string(),
    folio: v.string(),
    owner_name: v.string(),
    strap: v.string(),
    unit_number: v.float64(),
  }).index("leepa_by_unit_number", ["unit_number"])
  .searchIndex("leepa_unit_number_search", { searchField: "unit_number" }),
  leepa_sales: defineTable({
    sale_date: v.string(),
    sale_amount: v.float64(),
    unit_number: v.float64(),
  })
  .index("leepa_sales_by_unit_number", ["unit_number"])
  .index("leepa_sales_by_sale_date", ["sale_date"])
  .searchIndex("leepa_sales_unit_number_search", { searchField: "unit_number" }),
});