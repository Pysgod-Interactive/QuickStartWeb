import { defineMiddleware } from "astro:middleware";
import { isKilled, offlinePage } from "./lib/kill-switch.js";

export const onRequest = defineMiddleware(async (context, next) => {
  if (await isKilled(context.locals.runtime.env)) {
    return offlinePage();
  }
  return next();
});
