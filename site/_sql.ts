/*
 Language: SQL
 Website: https://en.wikipedia.org/wiki/SQL
 Category: common, database
 */

/*

Goals:

SQL is intended to highlight basic/common SQL keywords and expressions

- If pretty much every single SQL server includes supports, then it's a canidate.
- It is NOT intended to include tons of vendor specific keywords (Oracle, MySQL,
  PostgreSQL) although the list of data types is purposely a bit more expansive.
- For more specific SQL grammars please see:
  - PostgreSQL and PL/pgSQL - core
  - T-SQL - https://github.com/highlightjs/highlightjs-tsql
  - sql_more (core)

 */

export default function (hljs) {
  const regex = hljs.regex;
  const COMMENT_MODE = hljs.COMMENT("--", "$");
  const STRING = {
    className: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ begin: /''/ }],
      },
      // blob syntax
      {
        begin: /X'/,
        end: /'/,
        contains: [{ begin: /''/ }],
      },
    ],
  };
  const QUOTED_IDENTIFIER = {
    begin: /"/,
    end: /"/,
    contains: [{ begin: /""/ }],
  };

  const LITERALS = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown", // TODO remove?
  ];

  const MULTI_WORD_TYPES = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone",
  ];

  const TYPES = [
    "bigint",
    "binary",
    "blob",
    "boolean",
    "char",
    "character",
    "clob",
    "date",
    "dec",
    "decfloat",
    "decimal",
    "float",
    "int",
    "integer",
    "interval",
    "nchar",
    "nclob",
    "national",
    "numeric",
    "real",
    "row",
    "smallint",
    "text", // NEW
    "time",
    "timestamp",
    "varchar",
    "varying", // modifier (character varying)
    "varbinary",
    "json", // NEW
  ];

  const NON_RESERVED_WORDS = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view",
  ];

  const RESERVED_WORDS = [
    // https://www.sqlite.org/lang_keywords.html
    // NOT included: KEY
    ...`ABORT
ACTION
ADD
AFTER
ALL
ALTER
ALWAYS
ANALYZE
AND
AS
ASC
ATTACH
AUTOINCREMENT
BEFORE
BEGIN
BETWEEN
BY
CASCADE
CASE
CAST
CHECK
COLLATE
COLUMN
COMMIT
CONFLICT
CONSTRAINT
CREATE
CROSS
CURRENT
CURRENT_DATE
CURRENT_TIME
CURRENT_TIMESTAMP
DATABASE
DEFAULT
DEFERRABLE
DEFERRED
DELETE
DESC
DETACH
DISTINCT
DO
DROP
EACH
ELSE
END
ESCAPE
EXCEPT
EXCLUDE
EXCLUSIVE
EXISTS
EXPLAIN
FAIL
FILTER
FIRST
FOLLOWING
FOR
FOREIGN
FROM
FULL
GENERATED
GLOB
GROUP
GROUPS
HAVING
IF
IGNORE
IMMEDIATE
IN
INDEX
INDEXED
INITIALLY
INNER
INSERT
INSTEAD
INTERSECT
INTO
IS
ISNULL
JOIN
LAST
LEFT
LIKE
LIMIT
MATCH
MATERIALIZED
NATURAL
NO
NOT
NOTHING
NOTNULL
NULL
NULLS
OF
OFFSET
ON
OR
ORDER
OTHERS
OUTER
OVER
PARTITION
PLAN
PRAGMA
PRECEDING
PRIMARY
QUERY
RAISE
RANGE
RECURSIVE
REFERENCES
REGEXP
x->>
REINDEX
RELEASE
RENAME
REPLACE
RESTRICT
RETURNING
RIGHT
ROLLBACK
ROW
ROWS
SAVEPOINT
SELECT
SET
TABLE
TEMP
TEMPORARY
THEN
TIES
TO
TRANSACTION
TRIGGER
UNBOUNDED
UNION
UNIQUE
UPDATE
USING
VACUUM
VALUES
VIEW
VIRTUAL
WHEN
WHERE
WINDOW
WITH
WITHOUT
\.load
\.bail`.split("\n"),
  ];

  // these are reserved words we have identified to be functions
  // and should only be highlighted in a dispatch-like context
  // ie, array_agg(...), etc.
  const RESERVED_FUNCTIONS = [
    // select name from pragma_function_list where builtin group by 1 order by 1;
    ...`->
->>
x->>
abs
acos
acosh
asin
asinh
atan
atan2
atanh
avg
ceil
ceiling
changes
char
coalesce
cos
cosh
count
cume_dist
current_date
current_time
current_timestamp
date
datetime
degrees
dense_rank
exp
first_value
floor
format
glob
group_concat
hex
ifnull
iif
instr
json
json_array
json_array_length
json_extract
json_group_array
json_group_object
json_insert
json_object
json_patch
json_quote
json_remove
json_replace
json_set
json_type
json_valid
julianday
lag
last_insert_rowid
last_value
lead
length
like
likelihood
likely
ln
load_extension
log
log10
log2
lower
ltrim
max
min
mod
nth_value
ntile
nullif
percent_rank
pi
pow
power
printf
quote
radians
random
randomblob
rank
replace
round
row_number
rtrim
sign
sin
sinh
sqlite_compileoption_get
sqlite_compileoption_used
sqlite_log
sqlite_offset
sqlite_source_id
sqlite_version
sqrt
strftime
substr
substring
subtype
sum
tan
tanh
time
total
total_changes
trim
trunc
typeof
unicode
unixepoch
unknown
unlikely
upper
zeroblob`.split("\n"),
    // select * from pragma_module_list order by 1;
    ...`bytecode
completion
dbstat
fsdir
fts3
fts3tokenize
fts4
fts4aux
generate_series
json_each
json_tree
pragma_function_list
pragma_module_list
pragma_table_info
rtree
rtree_i32
sqlite_dbdata
sqlite_dbpage
sqlite_dbptr
sqlite_stmt
tables_used
zipfile`.split("\n"),
    // https://www.sqlite.org/schematab.html
    ...`sqlite_schema sqlite_master sqlite_temp_schema sqlite_temp_master`.split(
      " "
    ),
  ];

  // these functions can
  const POSSIBLE_WITHOUT_PARENS = [
    ...`CURRENT
CURRENT_DATE
CURRENT_TIME
CURRENT_TIMESTAMP`.split("\n"),
    //`.load`.split(" "),
  ];

  // those exist to boost relevance making these very
  // "SQL like" keyword combos worth +1 extra relevance
  const COMBOS = [
    "create table",
    "create virtual table", // NEW
    "without rowid", // NEW
    "delete from", // NEW
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first",
  ];

  const FUNCTIONS = RESERVED_FUNCTIONS;

  const KEYWORDS = [...RESERVED_WORDS, ...NON_RESERVED_WORDS].filter(
    (keyword) => {
      return !RESERVED_FUNCTIONS.includes(keyword);
    }
  );

  const VARIABLE = {
    className: "variable",
    begin:
      // @xyz
      // :xyz
      // ? or ?NNN
      // $xyz or $xyz::(anything)
      /(@[a-z0-9]+)|(:[a-z0-9]+)|(\$[a-z0-9]+(::\([a-z0-9]+\))?)|(\?([0-9]*))/,
  };

  const OPERATOR = {
    className: "operator",
    // makes sure that the "->" and "->>" builtin functions aren't caught in this
    begin: /(?!->>)(?!->)(?=[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?)/,
    relevance: 0,
  };

  const FUNCTION_CALL = {
    begin: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
    relevance: 0,
    keywords: { built_in: FUNCTIONS },
  };

  // keywords with less than 3 letters are reduced in relevancy
  function reduceRelevancy(list, { exceptions, when } = {}) {
    const qualifyFn = when;
    exceptions = exceptions || [];
    return list.map((item) => {
      if (item.match(/\|\d+$/) || exceptions.includes(item)) {
        return item;
      } else if (qualifyFn(item)) {
        return `${item}|0`;
      } else {
        return item;
      }
    });
  }

  return {
    name: "SQL",
    case_insensitive: true,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b\.?[\w\.]+/,
      keyword: reduceRelevancy(KEYWORDS, { when: (x) => x.length < 3 }),
      literal: LITERALS,
      type: TYPES,
      built_in: POSSIBLE_WITHOUT_PARENS,
    },
    contains: [
      {
        className: "keyword",
        begin: /(primary key)|(foreign key)/i,
      },
      {
        begin: regex.either(...COMBOS),
        relevance: 0,
        keywords: {
          $pattern: /[\w\.]+/,
          keyword: KEYWORDS.concat(COMBOS),
          literal: LITERALS,
          type: TYPES,
        },
      },
      {
        className: "type",
        begin: regex.either(...MULTI_WORD_TYPES),
      },
      {
        className: "prompt",
        begin: /sqlite\> */,
      },
      {
        className: "built_in",
        begin: /(->>)|(->)/,
      },
      {
        className: "dotcommand",
        begin: regex.either(
          ...`archive
auth
backup
bail
binary
cd
changes
check
clone
connection
databases
dbconfig
dbinfo
dump
echo
eqp
excel
exit
expert
explain
filectrl
fullschema
header
headers
help
import
imposter
indexes
limit
lint
load
log
mode
nonce
nullvalue
once
open
output
parameter
print
progress
prompt
quit
read
recover
restore
save
scanstats
schema
selftest
separator
sha3sum
shell
show
stats
system
tables
testcase
testctrl
timeout
timer
trace
vfsinfo
vfslist
vfsname
width`
            .split("\n")
            .map((d) => `\\.${d}`)
        ),
      },
      FUNCTION_CALL,
      VARIABLE,
      STRING,
      QUOTED_IDENTIFIER,
      hljs.C_NUMBER_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE,
      OPERATOR,
    ],
  };
}
