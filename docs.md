# `sqlite-jsonschema` Documentation

A full reference to every function and module that `sqlite-jsonschema` offers.

As a reminder, `sqlite-jsonschema` follows semver and is pre v1, so breaking changes are to be expected.

## API Reference

<h3 name="jsonschema_matches"><code>jsonschema_matches(schema, document)</code></h3>

Returns `1` if the given `document` matches the given `schema`, where `schema` is a valid JSON Schema. Returns `0` otherwise.

```sql
select jsonschema_matches('{"maxLength": 5}', json_quote('alex')); -- 1
select jsonschema_matches('{"maxLength": 5}', json_quote('alexxx')); -- 0

```

<h3 name="jsonschema_version"><code>jsonschema_version()</code></h3>

Returns the semver version string of the current version of `sqlite-jsonschema`.

```sql
select jsonschema_version(); -- 'v0.1.0'
```

<h3 name="jsonschema_debug"><code>jsonschema_debug()</code></h3>

Returns a debug string of various info about `sqlite-jsonschema`, including
the version string, build date, and commit hash.

```sql
select jsonschema_debug();
'Version: v0.1.0
Source: 247dca8f4cea1abdc30ed3e852c3e5b71374c177'
```
