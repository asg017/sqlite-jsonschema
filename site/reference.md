---
title: API Reference
order: 1
---

# API Reference

A full reference to every function and module that `sqlite-jsonschema` offers.

As a reminder, `sqlite-jsonschema` follows semver and is pre v1, so breaking changes are to be expected.

## SQL API

<h3 id="jsonschema_matches"><a href="#jsonschema_matches">#</a><code>jsonschema_matches(schema, document)</code></h3>

Returns `1` if the given `document` matches the given `schema`, where `schema` is a valid JSON Schema. Returns `0` otherwise.

```sql
select jsonschema_matches(
  '{"maxLength": 5}',
  json_quote('alex')
); -- 1

select jsonschema_matches(
  '{"maxLength": 5}',
  json_quote('alexxx')
); -- 0
```

<h3 id="jsonschema_version"><a href="#jsonschema_version">#</a><code>jsonschema_version()</code></h3>

Returns the semver version string of the current version of `sqlite-jsonschema`.

```sql
select jsonschema_version(); -- 'v0.2.1'
```

<h3 id="jsonschema_debug"><a href="#jsonschema_debug">#</a><code>jsonschema_debug()</code></h3>

Returns a debug string of various info about `sqlite-jsonschema`, including
the version string, build date, and commit hash.

```sql
select jsonschema_debug();
/*
'Version: v0.2.1
Source: 52adccb319fb4f89f04d6ea696fedef3db198ed8
'
*/
```
