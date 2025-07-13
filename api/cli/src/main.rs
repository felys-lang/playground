mod mapping;

use crate::mapping::O;
use clap::Parser;
use felys::{Output, Packrat};
use mapping::I;
use serde_json::Error;

#[derive(Parser)]
struct Args {
    json: String,
}

fn main() -> Result<(), Error> {
    let args = Args::parse();
    let i = serde_json::from_str::<I>(args.json.as_str())?;
    let o = match run(i) {
        Ok(output) => O::ok(output),
        Err(msg) => O::err(msg),
    };
    let result = serde_json::to_string(&o)?;
    print!("{result}");
    Ok(())
}

fn run(i: I) -> Result<Output, String> {
    let config = i.config.config(100, 0.9, 42)?;
    let output = Packrat::from(i.code).parse()?.config(config).exec()?;
    Ok(output)
}
