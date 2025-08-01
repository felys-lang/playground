import { Dispatch, SetStateAction } from "react";

export type Codebase = {
  cursor: number;
  programs: {
    name: string;
    code: string;
    locked: boolean;
    output: Output;
  }[];
};

export type SetCodebase = Dispatch<SetStateAction<Codebase>>;

export type Output = {
  params: Record<number, [Matrix, Matrix]>;
  stdout: string[];
  stderr: string;
  exit: string;
};

type Matrix = {
  linear: number[];
  shape: [number, number];
};

export type SetModal = Dispatch<SetStateAction<boolean>>;
