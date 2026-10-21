// Fails when dependencies can drift: version ranges in package.json, a lockfile
// out of sync with package.json, or prerelease builds of the AI/eve stack.
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const errors = [];

const EXACT = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
const declared = { ...pkg.dependencies, ...pkg.devDependencies };
for (const [name, version] of Object.entries(declared)) {
  if (!EXACT.test(version)) errors.push(`${name}: "${version}" is a range; pin an exact version`);
}

const lockRoot = lock.packages[""];
const locked = { ...lockRoot.dependencies, ...lockRoot.devDependencies };
for (const [name, version] of Object.entries(declared)) {
  if (locked[name] !== version) errors.push(`${name}: package.json has ${version}, lockfile root has ${locked[name]}; run npm install`);
  const installed = lock.packages[`node_modules/${name}`]?.version;
  if (installed !== version) errors.push(`${name}: lockfile resolves ${installed}, expected ${version}`);
}

// Canary/beta builds of these broke eve tool loops and webhook verification in the wild.
const GUARDED = /^node_modules\/(?:.*\/)?(ai|eve|@ai-sdk\/[^/]+|@vercel\/[^/]+)$/;
for (const [path, entry] of Object.entries(lock.packages)) {
  if (GUARDED.test(path) && /-(canary|beta|alpha|rc|snapshot)/.test(entry.version ?? "")) {
    errors.push(`${path.replace(/^.*node_modules\//, "")}@${entry.version} is a prerelease`);
  }
}

if (errors.length) {
  console.error(`Dependency drift check failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Dependencies pinned: ${Object.keys(declared).length} direct, lockfile in sync, no prerelease AI/eve packages.`);
