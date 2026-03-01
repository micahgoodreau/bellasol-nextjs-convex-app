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
  buildings: defineTable({
    building_number: v.float64(),
    association_number: v.float64(),
    street_address: v.string(),
  }).index("by_building_number", ["building_number"])
  .index("by_association_number", ["association_number"])
  .index("by_street_address", ["street_address"]),
  leepa_owners: defineTable({
    leepa_address_1: v.string(),
    leepa_address_2: v.string(),
    leepa_address_3: v.string(),
    leepa_address_4: v.string(),
    leepa_country: v.string(),
    leepa_folio: v.string(),
    leepa_owner_name: v.string(),
    leepa_strap: v.string(),
    property_unit_number: v.float64(),
    property_address: v.string(),
    property_city: v.string(),
    property_state: v.string(),
    property_zip: v.string(),
    property_building_number: v.float64(),
    property_association_number: v.float64(),
    property_type: v.string(),
    full_text: v.string(),
  }).index("leepa_by_unit_number", ["property_unit_number"])
  .searchIndex("leepa_unit_number_search", { searchField: "property_unit_number" })
  .searchIndex("leepa_owner_search", { searchField: "leepa_owner_name" })
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