from datasette import hookimpl
import sqlite_jsonschema

from datasette_sqlite_jsonschema.version import __version_info__, __version__ 

@hookimpl
def prepare_connection(conn):
    conn.enable_load_extension(True)
    sqlite_jsonschema.load(conn)
    conn.enable_load_extension(False)