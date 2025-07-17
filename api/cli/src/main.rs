mod mapping;

use crate::mapping::O;
use clap::Parser;
use felys::{Config, Output, Packrat};
use mapping::I;
use std::collections::HashMap;
use std::error::Error;
use std::fs;
use std::path::PathBuf;

#[derive(Parser)]
struct Args {
    path: PathBuf,
    depth: usize,
    momentum: f64,
    seed: usize,
}

fn main() -> Result<(), Box<dyn Error>> {
    let args = Args::parse();
    let json = fs::read_to_string(args.path)?;
    let i = serde_json::from_str::<I>(json.as_str())?;
    let o = run(i, args.depth, args.momentum, args.seed);
    let result = serde_json::to_string(&o)?;
    print!("{result}");
    Ok(())
}

fn run(i: I, depth: usize, momentum: f64, seed: usize) -> O {
    match wrapper(i, depth, momentum, seed) {
        Ok(output) => O::ok(output),
        Err(msg) => O::err(msg),
    }
}

fn wrapper(i: I, depth: usize, momentum: f64, seed: usize) -> Result<Output, String> {
    let mut params = HashMap::new();
    for (i, (x, m)) in i.params {
        params.insert(i, (x.try_into()?, m.try_into()?));
    }
    let config = Config::new(params, depth, momentum, seed);
    let output = Packrat::from(i.code).parse()?.config(config).exec();
    Ok(output)
}
