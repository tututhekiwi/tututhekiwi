// Verifies that every <img>, <source srcset>, and favicon link in your HTML
// points to a file that exists in the repo.

import { readFileSync, existsSync } from "fs";
import { globby } from "globby";
import * as path from "path";
import cheerio from "cheerio";

const ROOT = process.cwd();

const isLocal = (p) =>
  p &&
  !p.startsWith("http://") &&
  !p.startsWith("https://") &&
  !p.startsWith("mailto:") &&
  !p.startsWith("#");

const files = await globby(["*.html"], { gitignore: true });

let failures = 0;
const missing = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const $ = cheerio.load(html);

  const toCheck = new Set();

  $("img[src]").each((_, el) => toCheck.add($(el).attr("src")));
  $("source[srcset]").each((_, el) => {
    ($(el).attr("srcset") || "")
      .split(",")
      .map((s) => s.trim().split(" ")[0])
      .filter(Boolean)
      .forEach((p) => toCheck.add(p));
  });
  $('link[rel="icon"][href], link[rel="apple-touch-icon"][href]').each((_, el) =>
    toCheck.add($(el).attr("href"))
  );

  for (const ref of toCheck) {
    if (!isLocal(ref)) continue;
    const full = path.join(ROOT, ref);
    if (!existsSync(full)) {
      failures++;
      missing.push({ file, ref });
    }
  }
}

if (failures > 0) {
  console.error("❌ Missing assets detected:");
  for (const m of missing) console.error(`- ${m.file} → ${m.ref}`);
  process.exit(1);
} else {
  console.log("✅ All referenced assets exist locally.");
}
