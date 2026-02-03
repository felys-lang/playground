"use client";
import Navbar from "@/components/navbar";
import Workbench from "@/components/workbench";
import { useState } from "react";
import {
  beloved,
  fibonacci,
  grouping,
  hoyoverse,
  playground,
  quickstart,
} from "./sample";

export type Codebase = {
  cursor: number;
  programs: {
    name: string;
    code: string;
    binary: Uint8Array | undefined;
    outcome: Outcome | undefined;
  }[];
};

export type Outcome = {
  stdout: string;
  result: string;
  success: boolean;
};

export default function Home() {
  const [codebase, setCodebase] = useState<Codebase>({
    cursor: 0,
    programs: [
      {
        name: "quickstart.fs",
        code: quickstart,
        binary: undefined,
        outcome: undefined,
      },
      {
        name: "grouping.fs",
        code: grouping,
        binary: undefined,
        outcome: undefined,
      },
      {
        name: "fibonacci.fs",
        code: fibonacci,
        binary: undefined,
        outcome: undefined,
      },
      {
        name: "hoyoverse.fs",
        code: hoyoverse,
        binary: undefined,
        outcome: undefined,
      },
      {
        name: "beloved.fs",
        code: beloved,
        binary: undefined,
        outcome: undefined,
      },
      {
        name: "playground.fs",
        code: playground,
        binary: undefined,
        outcome: undefined,
      },
    ],
  });

  return (
    <>
      <Navbar codebase={codebase} setCodebase={setCodebase} />
      <Workbench codebase={codebase} setCodebase={setCodebase} />
    </>
  );
}
