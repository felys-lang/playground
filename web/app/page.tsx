"use client";
import { useState } from "react";
import Workbench from "@/components/workbench";
import Navbar from "@/components/navbar";
import { author, elysia, hoyoverse, iris, playground } from "@/app/samples";
import { Codebase } from "@/components/alias";

export default function Home() {
  const [codebase, setCodebase] = useState<Codebase>({
    cursor: 0,
    programs: [
      {
        name: "elysia.ely",
        code: elysia,
        locked: false,
        output: {
          params: {},
          stdout: [],
          stderr: "",
          exit: "",
        },
      },
      {
        name: "hoyoverse.ely",
        code: hoyoverse,
        locked: false,
        output: {
          params: {},
          stdout: [],
          stderr: "",
          exit: "",
        },
      },
      {
        name: "iris.ely",
        code: iris,
        locked: true,
        output: {
          params: {},
          stdout: [],
          stderr: "",
          exit: "",
        },
      },
      {
        name: "author.ely",
        code: author,
        locked: false,
        output: {
          params: {},
          stdout: [],
          stderr: "",
          exit: "",
        },
      },
      {
        name: "playground.ely",
        code: playground,
        locked: false,
        output: {
          params: {},
          stdout: [],
          stderr: "",
          exit: "",
        },
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
