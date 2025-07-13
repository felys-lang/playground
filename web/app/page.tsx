"use client";
import { useState } from "react";
import Workbench from "@/components/workbench";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { author, elysia, hoyoverse, iris, playground } from "@/app/samples";

export default function Home() {
  const [codebase, setCodebase] = useState({
    cursor: 0,
    name: ["elysia", "hoyoverse", "iris", "author", "playground"],
    code: [elysia, hoyoverse, iris, author, playground],
  });

  return (
    <>
      <Navbar codebase={codebase} setCodebase={setCodebase} />
      <Workbench codebase={codebase} setCodebase={setCodebase} />
      <Footer />
    </>
  );
}
