import { download } from "https://deno.land/x/plug@1.0.1/mod.ts";
import meta from "./deno.json" assert { type: "json" };

const BASE = `${meta.github}/releases/download/${meta.version}`;

// Similar to https://github.com/denodrivers/sqlite3/blob/f7529897720631c2341b713f0d78d4d668593ea9/src/ffi.ts#L561
let path: string;
try {
  const customPath = Deno.env.get("DENO_SQLITE_JSONSCHEMA_PATH");
  if (customPath) path = customPath;
  else {
    path = await download({
      url: {
        darwin: {
          aarch64: `${BASE}/deno-darwin-aarch64.jsonschema0.dylib`,
          x86_64: `${BASE}/deno-darwin-x86_64.jsonschema0.dylib`,
        },
        windows: {
          x86_64: `${BASE}/deno-windows-x86_64.jsonschema0.dll`,
        },
        linux: {
          x86_64: `${BASE}/deno-linux-x86_64.jsonschema0.so`,
        },
      },
      suffixes: {
        darwin: "",
        linux: "",
        windows: "",
      },
    });
  }
} catch (e) {
  if (e instanceof Deno.errors.PermissionDenied) {
    throw e;
  }

  const error = new Error("Failed to load sqlite-jsonschema extension");
  error.cause = e;

  throw error;
}

export function getLoadablePath(): string {
  return path;
}
