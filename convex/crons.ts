import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "updateLeepaOwner",
  { minutes: 1440 }, // every day
  internal.myFunctions.doSomething
);
export default crons;