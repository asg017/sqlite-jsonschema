---
project: sqlite-jsonschema
---

# sqlite-jsonschema

A SQLite extension for validating JSON objects with [JSON Schema](https://json-schema.org/). Based on [`sqlite-loadable-rs`](https://github.com/asg017/sqlite-loadable-rs) and the [`jsonschema` crate](https://crates.io/crates/jsonschema).

Available on `pip` for Python, `npm` for Node.js, `deno.land/x` for Deno, and pre-compiled extensions on Github Releases.

## Usage

TODO

- [ ] ".header on" color on/off, "mode box" color box/quote/etc

```sql
select regex_find(
  '[0-9]{3}-[0-9]{3}-[0-9]{4}',
  'phone: 111-222-3333'
);
-- '111-222-3333'

select rowid, *
from regex_find_all(
  '\b\w{13}\b',
  'Retroactively relinquishing remunerations is reprehensible.'
);
/*
┌───────┬───────┬─────┬───────────────┐
│ rowid │ start │ end │     match     │
├───────┼───────┼─────┼───────────────┤
│ 0     │ 0     │ 13  │ Retroactively │
│ 1     │ 14    │ 27  │ relinquishing │
│ 2     │ 28    │ 41  │ remunerations │
│ 3     │ 45    │ 58  │ reprehensible │
└───────┴───────┴─────┴───────────────┘
*/
```

```sql
.load ./jsonschema
.mode box
.header on

select
  value ->> '$.key.value',
  value -> '$.key.value',
  1 - 2 << 5;

create table students(
  id text primary key,
  district text,
  foreign key (district) references district(id),
  -- age in years
  age integer,
  -- full name, first and last
  name text
);

/*
  much longer comment!
*/
select
  key,
  value
from json_each(
  '[
    {"name": "alex"},
    {"name": "brian"}
  ]'
)
where value like 'ale%'
limit 50;


with matches as (
  select
    rowid,
    distance
  from vss_articles
  where vss_search(
    headline_embedding,
    (
      select headline_embedding f
      rom articles
      where rowid = :id
    )
  )
  limit 20
)
select
  articles.rowid,
  articles.headline,
  matches.distance
from matches
left join articles on articles.rowid = matches.rowid;
```

```sql
.load ./jsonschema0
select jsonschema_matches(
  '{"maxLength": 5}',
  json_quote('alex')
);
```

Use with SQLite's [`CHECK` constraints](https://www.sqlite.org/lang_createtable.html#check_constraints) to validate JSON columns before inserting into a table.

```sql
CREATE TABLE customer(
  cust_id INTEGER PRIMARY KEY,
  cust_name TEXT,
  cust_addr TEXT
);

SELECT * FROM email WHERE email MATCH 'fts5';

attach database './yo.db' as yo;

select @variable;

-- TODO
select :variable;
select $variable, $var::(blaog);
select ?, ?1;

pragma table_info;

select
  null,
  'single',
  "double",
  1234,
  -987,
  0xdeadbeef,
  X'53514C697465';
```

```sql
create virtual table xyz using vss0(
  headline_embedding(2048),
);

select
  1 + 2 - 4 >>, --x
  event ->> '$.table',
  event x->> '$.table',
  event.timestamp,
  event.result regexp '^abc$',
  name like '%yo%',
  datetime() as created_at,
  sqlite_compileoption_get(),
  x is not null,
  x is null,
  y is true,
  y is not false,
  y is false,
  json_object(
    'a', json_array(1,2,3),
    'b', json_object('name', 'alex'),
    'c', json('{"": "pls"}'),
    'd', json_valid('[]')
  ),
from logs
join json_each(logs.line) as event
order by created_at asc
limit 20;

create view x as select 1, 2, 3 from b;

create table students(
  id text,
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

## See also

- [sqlite-xsv](https://github.com/asg017/sqlite-xsv), A SQLite extension for working with CSVs
- [sqlite-loadable](https://github.com/asg017/sqlite-loadable-rs), A framework for writing SQLite extensions in Rust
- [sqlite-http](https://github.com/asg017/sqlite-http), A SQLite extension for making HTTP requests
