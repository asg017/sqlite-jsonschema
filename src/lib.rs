mod meta;
mod jsonschema;

pub use crate::{
  meta::{jsonschema_version, jsonschema_debug},
  jsonschema::{jsonschema_matches}
};

use sqlite3_loadable::{
    errors::Result,
    scalar::define_scalar_function,
    sqlite3, sqlite3_entrypoint, sqlite3_imports,
    //table::{define_table_function, define_virtual_table},
};

sqlite3_imports!();

#[sqlite3_entrypoint]
pub fn sqlite3_jsonschema_init(db: *mut sqlite3) -> Result<()> {
    define_scalar_function(db, "jsonschema_version", 0, jsonschema_version)?;
    define_scalar_function(db, "jsonschema_debug", 0, jsonschema_debug)?;
    define_scalar_function(db, "jsonschema_matches", 2, jsonschema_matches)?;

    Ok(())
}
