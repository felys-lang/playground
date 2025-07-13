use felys::{Config, Matrix, Output};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

type Fxx = f64;

#[derive(Serialize, Deserialize)]
pub struct M {
    linear: Vec<Fxx>,
    shape: (usize, usize),
}

impl From<Matrix> for M {
    fn from(value: Matrix) -> Self {
        Self {
            linear: value.linear,
            shape: (value.shape.0, value.shape.1),
        }
    }
}

impl M {
    pub fn matrix(self) -> Result<Matrix, String> {
        Matrix::new(self.linear, self.shape)
    }
}

#[derive(Deserialize)]
pub struct C {
    params: HashMap<usize, (M, M)>,
}

impl C {
    pub fn config(self, depth: usize, momentum: f64, seed: usize) -> Result<Config, String> {
        let mut params = HashMap::new();
        for (i, (x, m)) in self.params {
            params.insert(i, (x.matrix()?, m.matrix()?));
        }
        Ok(Config::new(params, depth, momentum, seed))
    }
}

#[derive(Deserialize)]
pub struct I {
    pub code: String,
    pub config: C,
}

#[derive(Serialize)]
pub struct O {
    params: HashMap<usize, (M, M)>,
    stdout: Vec<String>,
    msg: String,
}

impl O {
    pub fn ok(output: Output) -> Self {
        let mut params = HashMap::new();
        for (i, (x, m)) in output.parameters {
            params.insert(i, (x.into(), m.into()));
        }
        Self {
            params,
            stdout: output.stdout,
            msg: "success".to_string(),
        }
    }

    pub fn err(msg: String) -> Self {
        Self {
            params: HashMap::new(),
            stdout: Vec::new(),
            msg,
        }
    }
}
