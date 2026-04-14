import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const updateLeepaOwner = internalMutation({
  args: {
    _id: v.id("leepa_owners"),
    owner_name: v.string(),
    address_1: v.string(),
    address_2: v.string(),
    address_3: v.string(),
    address_4: v.string(),
    country: v.string(),
    building_number: v.float64(),
    unit_number: v.float64(),
    folio: v.string(),
    full_text: v.string(),
   },
  handler: async (ctx, args) => {
    await ctx.db.patch("leepa_owners", args._id, {
        owner_name: args.owner_name,
        address_1: args.address_1,
        address_2: args.address_2,
        address_3: args.address_3,
        address_4: args.address_4,
        country: args.country,
        building_number: args.building_number,
        unit_number: args.unit_number,
        folio: args.folio,
        full_text: args.full_text,
    });
  },
});