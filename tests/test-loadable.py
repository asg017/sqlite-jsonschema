import sqlite3
import unittest
import time
import os

EXT_PATH="./dist/debug/jsonschema0"

def connect(ext):
  db = sqlite3.connect(":memory:")

  db.execute("create table base_functions as select name from pragma_function_list")
  db.execute("create table base_modules as select name from pragma_module_list")

  db.enable_load_extension(True)
  db.load_extension(ext)

  db.execute("create temp table loaded_functions as select name from pragma_function_list where name not in (select name from base_functions) order by name")
  db.execute("create temp table loaded_modules as select name from pragma_module_list where name not in (select name from base_modules) order by name")

  db.row_factory = sqlite3.Row
  return db


db = connect(EXT_PATH)

def explain_query_plan(sql):
  return db.execute("explain query plan " + sql).fetchone()["detail"]

def execute_all(sql, args=None):
  if args is None: args = []
  results = db.execute(sql, args).fetchall()
  return list(map(lambda x: dict(x), results))

FUNCTIONS = [
  "jsonschema_debug",
  "jsonschema_matches",
  "jsonschema_version",
]

MODULES = []
class TestJsonschema(unittest.TestCase):
  def test_funcs(self):
    funcs = list(map(lambda a: a[0], db.execute("select name from loaded_functions").fetchall()))
    self.assertEqual(funcs, FUNCTIONS)

  def test_modules(self):
    modules = list(map(lambda a: a[0], db.execute("select name from loaded_modules").fetchall()))
    self.assertEqual(modules, MODULES)
    
  def test_jsonschema_version(self):
    self.assertEqual(db.execute("select jsonschema_version()").fetchone()[0][0], "v")
  
  def test_jsonschema_debug(self):
    debug = db.execute("select jsonschema_debug()").fetchone()[0]
    self.assertEqual(len(debug.splitlines()), 2)
  
  def test_jsonschema_matches(self):
    jsonschema_matches = lambda schema, instance: db.execute("select jsonschema_matches(?, ?)", [schema, instance]).fetchone()[0]
    self.assertEqual(jsonschema_matches('{"maxLength": 5}', '"aaaaa"'), 1)
    self.assertEqual(jsonschema_matches('{"maxLength": 5}', '"aaaaaa"'), 0)

  
class TestCoverage(unittest.TestCase):                                      
  def test_coverage(self):                                                      
    test_methods = [method for method in dir(TestJsonschema) if method.startswith('test_')]
    funcs_with_tests = set([x.replace("test_", "") for x in test_methods])
    
    for func in FUNCTIONS:
      self.assertTrue(func in funcs_with_tests, f"{func} does not have corresponding test in {funcs_with_tests}")
    
    for module in MODULES:
      self.assertTrue(module in funcs_with_tests, f"{module} does not have corresponding test in {funcs_with_tests}")

if __name__ == '__main__':
    unittest.main()