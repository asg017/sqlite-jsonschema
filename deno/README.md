<!--- Generated with the deno_generate_package.sh script, don't edit by hand! -->

# `x/sqlite_jsonschema` Deno Module

[![Tags](https://img.shields.io/github/release/asg017/sqlite-jsonschema)](https://github.com/asg017/sqlite-jsonschema/releases)
[![Doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/sqlite-jsonschema@0.2.3-alpha.6/mod.ts)

The [`sqlite-jsonschema`](https://github.com/asg017/sqlite-jsonschema) SQLite extension is available to Deno developers with the [`x/sqlite_jsonschema`](https://deno.land/x/sqlite-jsonschema) Deno module. It works with [`x/sqlite3`](https://deno.land/x/sqlite3), the fastest and native Deno SQLite3 module.

```js
import { Database } from "https://deno.land/x/sqlite3@0.8.0/mod.ts";
import * as sqlite_jsonschema from "https://deno.land/x/sqlite_jsonschema@v0.2.3-alpha.6/mod.ts";

const db = new Database(":memory:");

  db.enableLoadExtension = true;
  db.loadExtension(sqlite_jsonschema.getLoadablePath());

  const [version] = db
    .prepare("select jsonschema_version()")
    .value<[string]>()!;

  console.log(version);

```

Like `x/sqlite3`, `x/sqlite_jsonschema` requires network and filesystem permissions to download and cache the pre-compiled SQLite extension for your machine. Though `x/sqlite3` already requires `--allow-ffi` and `--unstable`, so you might as well use `--allow-all`/`-A`.

```bash
deno run -A --unstable <file>
```

`x/sqlite_jsonschema` does not work with [`x/sqlite`](https://deno.land/x/sqlite@v3.7.0), which is a WASM-based Deno SQLite module that does not support loading extensions.
