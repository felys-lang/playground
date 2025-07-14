"use client";
import { useState } from "react";
import Workbench from "@/components/workbench";
import Navbar from "@/components/navbar";
import { author, elysia, hoyoverse, iris, playground } from "@/app/samples";
import { Codebase, Output } from "@/components/alias";

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
        },
      },
      {
        name: "iris.ely",
        code: iris,
        locked: false,
        output: {
          params: {},
          stdout: [],
          stderr: "",
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
