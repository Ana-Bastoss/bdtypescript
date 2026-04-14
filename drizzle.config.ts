import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts", 
  out: "./drizzle",      
  driver: "better-sqlite",
  dbCredentials: {
    url: "banco.sqlite", 
  }
});