use felys::{Matrix, Output};
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
            shape: value.shape,
        }
    }
}

impl TryFrom<M> for Matrix {
    type Error = String;
    fn try_from(value: M) -> Result<Self, Self::Error> {
        Matrix::new(value.linear, value.shape)
    }
}

#[derive(Deserialize)]
pub struct I {
    pub code: String,
    pub params: HashMap<usize, (M, M)>,
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
        for (i, (x, m)) in output.params {
            params.insert(i, (x.into(), m.into()));
        }
        Self {
            params,
            stdout: output.stdout,
            msg: "".to_string(),
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
