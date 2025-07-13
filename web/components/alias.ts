import { Dispatch, SetStateAction } from "react";

export type Codebase = {
  cursor: number;
  name: string[];
  code: string[];
};

export type SetCodebase = Dispatch<SetStateAction<Codebase>>;

export type Result = {
  elapsed: string;
  result: string;
};

export type SetResult = Dispatch<SetStateAction<Result | undefined>>;

export type SetModal = Dispatch<SetStateAction<boolean>>;
