import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export async function GET() {
  const filePath = path.join(process.cwd(), "scenarios.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents);
  return NextResponse.json(data);
}
