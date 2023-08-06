# sqlite-jsonschema

A SQLite extension for validating JSON objects with [JSON Schema](https://json-schema.org/). Based on [`sqlite-loadable-rs`](https://github.com/asg017/sqlite-loadable-rs) and the [`jsonschema` crate](https://crates.io/crates/jsonschema).

If your company or organization finds this library useful, consider [supporting my work](#supporting)!

## Usage

```sql
.load ./jsonschema0
select jsonschema_matches('{"maxLength": 5}', json_quote('alex'));
```

Use with SQLite's [`CHECK` constraints](https://www.sqlite.org/lang_createtable.html#check_constraints) to validate JSON columns before inserting into a table.

```sql
create table students(
  -- ensure that JSON objects stored in the data column have "firstName" strings,
  -- "lastName" strings, and "age" integers that are greater than 0.
  data json check (
    jsonschema_matches(
      json('
        {
          "type": "object",
          "properties": {
            "firstName": {
              "type": "string"
            },
            "lastName": {
              "type": "string"
            },
            "age": {
              "type": "integer",
              "minimum": 0
            }
          }
        }
        '),
      data
    )
  )
);

insert into students(data)
  values ('{"firstName": "Alex", "lastName": "Garcia", "age": 100}');
-- ✓


insert into students(data)
  values ('{"firstName": "Alex", "lastName": "Garcia", "age": -1}');
-- Runtime error: CHECK constraint failed: jsonschema_matches

```

Find all the values in a column that don't match a JSON Schema.

```sql
select
  rowid,
  jsonschema_matches(
    '{
      "type": "array",
      "items": {
        "type": "number"
      }
    }',
    foo
  ) as valid
from bar
where not valid;
```

## Installing

| Language       | Install                                                                  |                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Python         | `pip install sqlite-jsonschema`                                          | [![PyPI](https://img.shields.io/pypi/v/sqlite-jsonschema.svg?color=blue&logo=python&logoColor=white)](https://pypi.org/project/sqlite-jsonschema/)                                                      |
| Datasette      | `datasette install datasette-sqlite-jsonschema`                          | [![Datasette](https://img.shields.io/pypi/v/datasette-sqlite-jsonschema.svg?color=B6B6D9&label=Datasette+plugin&logoColor=white&logo=python)](https://datasette.io/plugins/datasette-sqlite-jsonschema) |
| Node.js        | `npm install sqlite-jsonschema`                                          | [![npm](https://img.shields.io/npm/v/sqlite-jsonschema.svg?color=green&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/sqlite-jsonschema)                                                |
| Deno           | [`deno.land/x/sqlite_jsonschema`](https://deno.land/x/sqlite_jsonschema) | [![deno.land/x release](https://img.shields.io/github/v/release/asg017/sqlite-jsonschema?color=fef8d2&include_prereleases&label=deno.land%2Fx&logo=deno)](https://deno.land/x/sqlite_jsonschema)        |
| Ruby           | `gem install sqlite-jsonschema`                                          | ![Gem](https://img.shields.io/gem/v/sqlite-jsonschema?color=red&logo=rubygems&logoColor=white)                                                                                                          |
| Github Release |                                                                          | ![GitHub tag (latest SemVer pre-release)](https://img.shields.io/github/v/tag/asg017/sqlite-jsonschema?color=lightgrey&include_prereleases&label=Github+release&logo=github)                            |
| Rust           | `cargo add sqlite-jsonschema`                                            | [![Crates.io](https://img.shields.io/crates/v/sqlite-jsonschema?logo=rust)](https://crates.io/crates/sqlite-jsonschema)                                                                                 |

<!--
| Elixir         | [`hex.pm/packages/sqlite_jsonschema`](https://hex.pm/packages/sqlite_jsonschema) | [![Hex.pm](https://img.shields.io/hexpm/v/sqlite_jsonschema?color=purple&logo=elixir)](https://hex.pm/packages/sqlite_jsonschema)                                                                       |
| Go             | `go get -u github.com/asg017/sqlite-jsonschema/bindings/go`               | [![Go Reference](https://pkg.go.dev/badge/github.com/asg017/sqlite-jsonschema/bindings/go.svg)](https://pkg.go.dev/github.com/asg017/sqlite-jsonschema/bindings/go)                                     |
-->

`sqlite-jsonschema` is distributed on pip, npm, and https://deno.land/x for Python, Node.js, and Deno programmers. There are also pre-built extensions available for use in other environments.

### Python

For Python developers, use the [`sqlite-jsonschema` Python package](https://pypi.org/package/sqlite-jsonschema/):

```
pip install sqlite-jsonschema
```

The `sqlite-jsonschema` extension can then be loaded into a [`sqlite3` Connection object](https://docs.python.org/3/library/sqlite3.html#connection-objects).

```python
import sqlite3
import sqlite_jsonschema

db = sqlite3.connect(':memory:')
sqlite_jsonschema.load(db)
db.execute('select jsonschema_version(), jsonschema()').fetchone()
```

See [_Using `sqlite-jsonschema` with Python_](https://alexgarcia.jsonschema/sqlite-jsonschema/usage/python.html) for details.

### Node.js

For Node.js developers, use the [`sqlite-jsonschema` NPM package](https://www.npmjs.com/package/sqlite-jsonschema):

```
npm install sqlite-jsonschema
```

The `sqlite-jsonschema` extension can then be loaded into a [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) or [`node-sqlite3`](https://github.com/TryGhost/node-sqlite3) connection.

```javascript
import Database from "better-sqlite3";
import * as sqlite_jsonschema from "sqlite-jsonschema";

const db = new Database(":memory:");

db.loadExtension(sqlite_jsonschema.getLoadablePath());

const version = db.prepare("select jsonschema_version()").pluck().get();
console.log(version); // "v0.2.0"
```

See [_Using `sqlite-jsonschema` with Node.js_](https://alexgarcia.jsonschema/sqlite-jsonschema/usage/node.html) for details.

### Deno

For [Deno](https://deno.land/) developers, use the [x/sqlite_jsonschema](https://deno.land/x/sqlite_jsonschema@v0.2.2) Deno module with [`x/sqlite3`](https://deno.land/x/sqlite3@0.8.1).

```javascript
import { Database } from "https://deno.land/x/sqlite3@0.8.0/mod.ts";
import * as sqlite_jsonschema from "https://deno.land/x/sqlite_jsonschema/mod.ts";

const db = new Database(":memory:");

db.enableLoadExtension = true;
db.loadExtension(sqlite_jsonschema.getLoadablePath());

const [version] = db
  .prepare("select jsonschema_version()")
  .value<[string]>()!;

console.log(version);
```

See [_Using `sqlite-jsonschema` with Deno_](https://alexgarcia.jsonschema/sqlite-jsonschema/usage/deno.html) for details.

### Datasette

For [Datasette](https://datasette.io/), use the [`datasette-sqlite-jsonschema` plugin](https://datasette.io/plugins/datasette-sqlite-jsonschema) to include `sqlite-jsonschema` functions to your Datasette instances.

```
datasette install datasette-sqlite-jsonschema
```

See [_Using `sqlite-jsonschema` with Datasette_](https://alexgarcia.jsonschema/sqlite-jsonschema/usage/datasette.html) for details.

### `sqlite3` CLI

For [the `sqlite3` CLI](https://sqlite.org/cli.html), either [download a pre-compiled extension from the Releases page](https://github.com/asg017/sqlite-jsonschema/releases) or [build it yourself](#building-from-source). Then use the [`.load` dot command](https://sqlite.org/cli.html#loading_extensions).

```sql
.load ./jsonschema0
select jsonschema_version();
'v0.2.1'
```

### As a loadable extension

If you're using `sqlite-jsonschema` in a different way from those listed above, then [download a pre-compiled extension from the Releases page](https://github.com/asg017/sqlite-jsonschema/releases) and load it into your environment. Download the `jsonschema0.dylib` (for MacOS), `jsonschema0.so` (Linux), or `jsonschema0.dll` (Windows) file from a release and load it into your SQLite environment.

> **Note:**
> The `0` in the filename (`jsonschema0.dylib`/ `jsonschema0.so`/`jsonschema0.dll`) denotes the major version of `sqlite-jsonschema`. Currently `sqlite-jsonschema` is pre v1, so expect breaking changes in future versions.

Chances are there is some method called "loadExtension" or "load_extension" in the SQLite client library you are using. Alternatively, as a last resort, use [the `load_extension()` SQL function](https://www.sqlite.org/lang_corefunc.html#load_extension).

### Building from source

Make sure you have [Rust](https://www.rust-lang.org/tools/install), make, and a C compiler installed. Then `git clone` this repository and run `make loadable-release`.

```
git clone https://github.com/asg017/sqlite-jsonschema.git
cd sqlite-jsonschema
make loadable-release
```

Once complete, your compiled extension will appear under `dist/release/`, either as `jsonschema0.so`, `jsonschema0.dylib`, or `jsonschema0.dll`, depending on your operating system.

## Documentation

See [the full API Reference](https://alexgarcia.jsonschema/sqlite-jsonschema/reference.html) for every `sqlite-jsonschema` SQL function.

## Supporting

I (Alex 👋🏼) spent a lot of time and energy on this project and [many other open source projects](https://github.com/asg017?tab=repositories&q=&type=&language=&sort=stargazers). If your company or organization uses this library (or you're feeling generous), then please [consider supporting my work](https://alexgarcia.jsonschema/work.html), or share this project with a friend!

## See also

- [`sqlite-xsv`](https://github.com/asg017/sqlite-xsv), A SQLite extension for working with CSVs
- [`sqlite-http`](https://github.com/asg017/sqlite-http), A SQLite extension for making HTTP requests
- [`sqlite-loadable-rs`](https://github.com/asg017/sqlite-loadable-rs), A framework for writing SQLite extensions in Rust
