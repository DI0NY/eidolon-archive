import fs from "fs";
import path from "path";
import ExpeditionClient from "./ExpeditionClient";

export default function ExpeditionPage() {
  const mdPath = path.join(process.cwd(), "content", "expedition.md");
  const md = fs.readFileSync(mdPath, "utf8");

  return <ExpeditionClient md={md} />;
}