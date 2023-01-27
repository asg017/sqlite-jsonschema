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

## Installing

The [Releases page](https://github.com/asg017/sqlite-jsonschema/releases) contains pre-built binaries for Linux x86_64, MacOS, and Windows.

### As a loadable extension

If you want to use `sqlite-jsonschema` as a [Runtime-loadable extension](https://www.sqlite.org/loadext.html), Download the `jsonschema0.dylib` (for MacOS), `jsonschema0.so` (Linux), or `jsonschema0.dll` (Windows) file from a release and load it into your SQLite environment.

> **Note:**
> The `0` in the filename (`jsonschema0.dylib`/ `jsonschema0.so`/`jsonschema0.dll`) denotes the major version of `sqlite-jsonschema`. Currently `sqlite-jsonschema` is pre v1, so expect breaking changes in future versions.

For example, if you are using the [SQLite CLI](https://www.sqlite.org/cli.html), you can load the library like so:

```sql
.load ./jsonschema0
select jsonschema_version();
-- v0.1.0
```

Or in Python, using the builtin [sqlite3 module](https://docs.python.org/3/library/sqlite3.html):

```python
import sqlite3
con = sqlite3.connect(":memory:")
con.enable_load_extension(True)
con.load_extension("./jsonschema0")
print(con.execute("select jsonschema_version()").fetchone())
# ('v0.1.0',)
```

Or in Node.js using [better-sqlite3](https://github.com/WiseLibs/better-sqlite3):

```javascript
const Database = require("better-sqlite3");
const db = new Database(":memory:");
db.loadExtension("./jsonschema0");
console.log(db.prepare("select jsonschema_version()").get());
// { 'jsonschema_version()': 'v0.1.0' }
```

Or with [Datasette](https://datasette.io/):

```
datasette data.db --load-extension ./jsonschema0
```

## Supporting

I (Alex 👋🏼) spent a lot of time and energy on this project and [many other open source projects](https://github.com/asg017?tab=repositories&q=&type=&language=&sort=stargazers). If your company or organization uses this library (or you're feeling generous), then please [consider supporting my work](https://alexgarcia.xyz/work.html), or share this project with a friend!

## See also

- [sqlite-xsv](https://github.com/asg017/sqlite-xsv), A SQLite extension for working with CSVs
- [sqlite-loadable](https://github.com/asg017/sqlite-loadable-rs), A framework for writing SQLite extensions in Rust
- [sqlite-http](https://github.com/asg017/sqlite-http), A SQLite extension for making HTTP requests
