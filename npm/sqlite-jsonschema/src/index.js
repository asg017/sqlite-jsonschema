import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { arch, platform } from "node:process";
import { statSync } from "node:fs";

const supportedPlatforms = [
  ["darwin", "x64"],
  ["darwin", "arm64"],
  ["win32", "x64"],
  ["linux", "x64"],
];
function validPlatform(platform, arch) {
  return (
    supportedPlatforms.find(([p, a]) => platform == p && arch === a) !== null
  );
}
function extensionSuffix(platform) {
  if (platform === "win32") return "dll";
  if (platform === "darwin") return "dylib";
  return "so";
}

export function getLoadablePath() {
  if (!validPlatform(platform, arch)) {
    throw new Error(
      `Unsupported platform for sqlite-jsonschema, on a ${platform}-${arch} machine, but not in supported platforms (${supportedPlatforms
        .map(([p, a]) => `${p}-${a}`)
        .join(
          ","
        )}). Consult the sqlite-jsonschema NPM package README for details. `
    );
  }
  const loadablePath = join(
    fileURLToPath(new URL(".", import.meta.url)),
    "..",
    "..",
    `sqlite-jsonschema-${platform}-${arch}`,
    "lib",
    `jsonschema0.${extensionSuffix(platform)}`
  );
  if (!statSync(loadablePath, { throwIfNoEntry: false })) {
    throw new Error(
      `Loadble extension for sqlite-jsonschema not found. Was the sqlite-jsonschema-${platform}-${arch} package installed? Avoid using the --no-optional flag, as the optional dependencies for sqlite-jsonschema are required.`
    );
  }

  return loadablePath;
}
