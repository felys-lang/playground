import { Dispatch, SetStateAction } from "react";

export type Codebase = {
  cursor: number;
  name: string[];
  code: string[];
};

export type SetCodebase = Dispatch<SetStateAction<Codebase>>;

export type Result = {
  params: Record<number, [Matrix, Matrix]>;
  stdout: string[];
  stderr: string;
};

type Matrix = {
  linear: number[];
  shape: [number, number];
};

export type SetResult = Dispatch<SetStateAction<Result | undefined>>;

export type SetModal = Dispatch<SetStateAction<boolean>>;
