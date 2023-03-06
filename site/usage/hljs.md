---
title: highlight.js stuff
order: 99
---

Column types are highlighted correctly in `CREATE TABLE` statements.

```sql
create table students(
  name text,
  age int,
  progress decimal(20),
  data json
);
```

`CREATE VIRTUAL TABLE` statements, which are unique to SQLite, is also highlighted correctly.

```sql

create virtual table fts_emails using fts5(name, email, body);

```

All builtin functions to _most_ SQLite builds and most shell builtin functions are highlighted as well.

```sql

select

  -- all SQLite builtins functions are supported
  sqlite_version(),
  datetime() as created_at,
  format('%s %s', first_name, last_name) as name,
  max(age) as oldest,

  -- As well as JSON functions, including the new ->/->> syntax!
  json_extract(data, '$.email') as email,
  data ->> 'mailing_address'  as mailing_address
from students
-- and builtin table functions!
join json_each(students.assignments, '$.data')

```

If you include the `sqlite>` prompt prefix from the SQLite CLI, it will appear lighter and _is not copy+pasteable!_ Dot commands also have special highlighting.

```sql
sqlite> .load regex0
sqlite> .header on
sqlite> .mode quote
sqlite> select count(*) from students;
123
```

xxx

```sql

```
