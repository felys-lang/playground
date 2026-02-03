use felys::{Elysia, Object, PhiLia093};
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn compile(code: &str, o: usize) -> Result<Vec<u8>, String> {
    let mut buf = Vec::new();
    PhiLia093::from(code.to_string())
        .parse()?
        .cfg()?
        .optimize(o)?
        .codegen()
        .dump(&mut buf)
        .map_err(|_| "Elysia: failed to dump\n".to_string())?;
    Ok(buf)
}

#[derive(Serialize)]
struct Outcome {
    stdout: String,
    result: String,
    success: bool,
}

#[wasm_bindgen]
pub fn execute(src: Vec<u8>) -> JsValue {
    let mut stdout = String::new();
    let Ok(elysia) = Elysia::load(&mut src.as_slice()) else {
        let outcome = Outcome {
            stdout,
            result: "Elysia: failed to load\n".to_string(),
            success: false,
        };
        return serde_wasm_bindgen::to_value(&outcome).unwrap_or(JsValue::NULL);
    };

    let outcome = match elysia.exec(Object::List([].into()), &mut stdout) {
        Ok(obj) => Outcome {
            stdout,
            result: obj.to_string(),
            success: true,
        },
        Err(e) => Outcome {
            stdout,
            result: e,
            success: false,
        },
    };

    serde_wasm_bindgen::to_value(&outcome).unwrap_or(JsValue::NULL)
}
