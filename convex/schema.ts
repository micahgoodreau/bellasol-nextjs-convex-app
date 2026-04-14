import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import build from "next/dist/build";

export default defineSchema({
  contacts: defineTable({
    first_name: v.string(),
    last_name: v.string(),
    email: v.string(),
    unit: v.id("units"),
  }).index("by_unit", { fields: ["unit"] }),
  units: defineTable({
    association_number: v.float64(),
    building_number: v.float64(),
    city: v.string(),
    leepa_folio: v.string(),
    state: v.string(),
    leepa_strap: v.string(),
    street_address_1: v.string(),
    property_type: v.string(),
    unit_number: v.float64(),
    zip: v.string(),
  }).index("by_unit_number", ["unit_number"]),
  buildings: defineTable({
    building_number: v.float64(),
    association_number: v.float64(),
    street_address: v.string(),
  }).index("by_building_number", ["building_number"])
  .index("by_association_number", ["association_number"])
  .index("by_street_address", ["street_address"]),
  leepa_owners: defineTable({
    address_1: v.string(),
    address_2: v.string(),
    address_3: v.string(),
    address_4: v.string(),
    country: v.string(),
    owner_name: v.string(),
    unit_number: v.float64(),
    building_number: v.float64(),
    folio: v.string(),
    full_text: v.string(),
  }).index("leepa_by_unit_number", ["unit_number"])
  .searchIndex("leepa_owner_building_number_search", { searchField: "building_number" })
  .searchIndex("leepa_unit_number_search", { searchField: "unit_number" })
  .searchIndex("leepa_owner_search", { searchField: "owner_name" })
  .searchIndex("leepa_owner_full_text_search", { searchField: "full_text" }),
  leepa_sales: defineTable({
    sale_date: v.string(),
    sale_amount: v.float64(),
    unit_number: v.float64(),
  })
  .index("leepa_sales_by_unit_number", ["unit_number"])
  .index("leepa_sales_by_sale_date", ["sale_date"])
  .searchIndex("leepa_sales_unit_number_search", { searchField: "unit_number" }),
});