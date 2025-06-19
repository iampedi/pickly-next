// scripts/test.ts
import * as path from "path";
import "dotenv/config";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../.env.local") }); // یا "../.env" بسته به نیازت
import { prisma } from "../src/lib/prisma";

async function main() {
  const categories = await prisma.category.findMany();
  console.log("📦 Categories:", categories);
}

main();
