use std::{os::raw::c_void, ops::Deref};

use sqlite3_loadable::{api::{context_result_text, context_auxdata_get, value_text, context_auxdata_set, context_result_bool}, errors::Result, sqlite3_context, sqlite3_value, Error};
use jsonschema::JSONSchema;
use serde_json::json;

pub fn jsonschema_matches(context: *mut sqlite3_context, values: &[*mut sqlite3_value]) -> Result<()> {
  let (schema, set_aux) = arg0_as_schema(context, values)?;
  let instance = value_text(
    values
        .get(1)
        .ok_or_else(|| Error::new_message("expected 2nd argument as contents"))?
        .to_owned(),
  )?;
  let instance = serde_json::from_str(instance).map_err(|_| Error::new_message("Invalid JSON"))?;
  context_result_bool(context, schema.is_valid(&instance));
  //cleanup_arg0_regex(set_aux, context, re);
    Ok(())
}

struct ContextAuxData<'a> {
  set_aux: bool, 
  context: *mut sqlite3_context, 
  schema: &'a Box<JSONSchema>
}

impl<'a> Drop for ContextAuxData<'a> {
  fn drop(&mut self) {
    let p = Box::into_raw(Box::new(self.schema));
    if self.set_aux {
      context_auxdata_set(
          self.context,
          0,
          p.cast::<c_void>(),
          // TODO memory leak, box not destroyed?
          Some(cleanup),
      );
  } 
  }
}

fn arg0_as_schema(
  context: *mut sqlite3_context,
  values: &[*mut sqlite3_value],
) -> Result<(Box<JSONSchema>, bool)> {
  let mut set_aux = false;

  let auxdata = context_auxdata_get(context, 0);
  let re = if auxdata.is_null() {
      set_aux = true;
      let arg_schema = values
          .get(0)
          .ok_or_else(|| Error::new_message("expected 1st argument as schema"))?
          .to_owned();
      let schema = value_text(arg_schema)?;
      let schema = serde_json::from_str(schema).map_err(|_| Error::new_message("Invalid JSON"))?;
      let schema = JSONSchema::compile(&schema).map_err(|_| Error::new_message("Invalid schema"))?;

      let b = Box::new(schema);
      b
  } else {
      unsafe { Box::from_raw(auxdata as *mut JSONSchema) }
  };

  Ok((re, set_aux))
}

unsafe extern "C" fn cleanup(_arg1: *mut c_void) {}

fn cleanup_arg0_regex(set_aux: bool, context: *mut sqlite3_context, re: Box<JSONSchema>) {
  if set_aux {
      context_auxdata_set(
          context,
          0,
          Box::into_raw(re).cast::<c_void>(),
          // TODO memory leak, box not destroyed?
          Some(cleanup),
      );
  } else {
      Box::into_raw(re);
  }
}