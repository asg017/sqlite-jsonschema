---
title: Datasette
order: 3
---

# The `datasette-sqlite-jsonschema` Datasette Plugin

`datasette-sqlite-jsonschema` is a [Datasette plugin](https://docs.datasette.io/en/stable/plugins.html) that loads the [`sqlite-jsonschema`](https://github.com/asg017/sqlite-jsonschema) extension in Datasette instances, allowing you to generate and work with [TODO](https://github.com/jsonschema/spec) in SQL.

```
datasette install datasette-sqlite-jsonschema
```

See [`docs.md`](../../docs.md) for a full API reference for the jsonschema SQL functions.

Alternatively, when publishing Datasette instances, you can use the `--install` option to install the plugin.

```
datasette publish cloudrun data.db --service=my-service --install=datasette-sqlite-jsonschema

```
