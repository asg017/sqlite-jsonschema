---
title: sqlite3 CLI
order: 4
---

# `sqlite3` CLI

To use `sqlite-jsonschema` with the [`sqlite3` command line interface](https://sqlite.org/cli.html), either download a pre-compiled extension for your machine [from a Github Release](https://github.com/asg017/sqlite-jsonschema/releases), or [compile your own version](./source.html).

Once you have a `jsonschema0.so`, `jsonschema0.dylib`, or `jsonschema0.dll` extension, use the [`.load` command](https://sqlite.org/cli.html#loading_extensions) in the `sqlite3` CLI to load the extension into your connection.

```sql
sqlite> .load ./jsonschema0
sqlite> select jsonschema_version();
'v0.2.1'
```

You can include `.load ./jsonschema0` at the top of your `.sql` scripts to load `sqlite-jsonschema` into your projects.

In `build.sql`:

```sql
.bail on

.load ./jsonschema0

select jsonschema_version();
```

Then run with:

```bash
sqlite3 :memory: '.read build.sql'
```
