mod jsonschema;

use crate::jsonschema::jsonschema_matches;

use sqlite_loadable::prelude::*;
use sqlite_loadable::{api, define_scalar_function, Result};

pub fn jsonschema_version(
    context: *mut sqlite3_context,
    _values: &[*mut sqlite3_value],
) -> Result<()> {
    api::result_text(context, format!("v{}", env!("CARGO_PKG_VERSION")))?;
    Ok(())
}

pub fn jsonschema_debug(
    context: *mut sqlite3_context,
    _values: &[*mut sqlite3_value],
) -> Result<()> {
    api::result_text(
        context,
        format!(
            "Version: v{}
Source: {}
",
            env!("CARGO_PKG_VERSION"),
            env!("GIT_HASH")
        ),
    )?;
    Ok(())
}

#[sqlite_entrypoint]
pub fn sqlite3_jsonschema_init(db: *mut sqlite3) -> Result<()> {
    define_scalar_function(
        db,
        "jsonschema_version",
        0,
        jsonschema_version,
        FunctionFlags::UTF8 | FunctionFlags::DETERMINISTIC,
    )?;
    define_scalar_function(
        db,
        "jsonschema_debug",
        0,
        jsonschema_debug,
        FunctionFlags::UTF8 | FunctionFlags::DETERMINISTIC,
    )?;
    define_scalar_function(
        db,
        "jsonschema_matches",
        2,
        jsonschema_matches,
        FunctionFlags::UTF8,
    )?;

    Ok(())
}
