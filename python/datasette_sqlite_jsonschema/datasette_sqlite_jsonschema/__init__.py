from datasette import hookimpl
import sqlite_jsonschema

@hookimpl
def prepare_connection(conn):
    conn.enable_load_extension(True)
    sqlite_jsonschema.load(conn)
    conn.enable_load_extension(False)