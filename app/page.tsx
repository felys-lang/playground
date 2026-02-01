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
    modified: boolean;
    outcome: Outcome | undefined;
  }[];
};

export type Outcome = {
  stdout: string;
  reuslt: string;
  success: boolean;
};

export default function Home() {
  const [codebase, setCodebase] = useState<Codebase>({
    cursor: 0,
    programs: [
      {
        name: "playground.fs",
        code: playground,
        modified: true,
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
