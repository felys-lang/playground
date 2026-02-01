"use client";
import Navbar from "@/components/navbar";
import Workbench from "@/components/workbench";
import { useState } from "react";
import { playground } from "./sample";

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
