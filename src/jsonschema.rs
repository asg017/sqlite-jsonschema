use std::os::raw::c_void;

use jsonschema::JSONSchema;
use sqlite_loadable::prelude::*;
use sqlite_loadable::{api, Error, Result};

pub fn jsonschema_matches(
    context: *mut sqlite3_context,
    values: &[*mut sqlite3_value],
) -> Result<()> {
    let (schema, input_type) = jsonschema_from_value_or_cache(context, values, 0)?;
    let instance = api::value_text(
        values
            .get(1)
            .ok_or_else(|| Error::new_message("expected 2nd argument as contents"))?,
    )?;
    let instance = serde_json::from_str(instance)
        .map_err(|e| Error::new_message(format!("Invalid JSON: {}", e).as_str()))?;
    api::result_bool(context, schema.is_valid(&instance));
    cleanup_regex_value_cached(context, schema, input_type);
    Ok(())
}

pub enum RegexInputType {
    TextInitial(usize),
    GetAuxdata,
}
pub fn jsonschema_from_value_or_cache(
    context: *mut sqlite3_context,
    values: &[*mut sqlite3_value],
    at: usize,
) -> Result<(Box<JSONSchema>, RegexInputType)> {
    let value = values
        .get(at)
        .ok_or_else(|| Error::new_message("expected 1st argument as pattern"))?;

    // Step 1: If sqlite3_get_auxdata returns a pointer, then use that.
    let auxdata = api::auxdata_get(context, at as i32);
    if !auxdata.is_null() {
        Ok((
            unsafe { Box::from_raw(auxdata.cast::<JSONSchema>()) },
            RegexInputType::GetAuxdata,
        ))
    } else {
        // Step 3: if a string is passed in, then try to make
        // a regex from that, and return a flag to call sqlite3_set_auxdata

        let schema = api::value_text(value)?;
        let schema =
            serde_json::from_str(schema).map_err(|_| Error::new_message("Invalid JSON"))?;
        let schema =
            JSONSchema::compile(&schema).map_err(|_| Error::new_message("Invalid schema"))?;
        Ok((Box::new(schema), RegexInputType::TextInitial(at)))
    }
}

unsafe extern "C" fn cleanup(p: *mut c_void) {
    drop(Box::from_raw(p.cast::<*mut JSONSchema>()))
}

pub fn cleanup_regex_value_cached(
    context: *mut sqlite3_context,
    regex: Box<JSONSchema>,
    input_type: RegexInputType,
) {
    let pointer = Box::into_raw(regex);
    match input_type {
        RegexInputType::GetAuxdata => {}
        RegexInputType::TextInitial(at) => {
            api::auxdata_set(
                context,
                at as i32,
                pointer.cast::<c_void>(),
                // TODO memory leak, box not destroyed?
                Some(cleanup),
            )
        }
    }
}
