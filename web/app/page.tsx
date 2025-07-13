"use client";
import { useState } from "react";
import Workbench from "@/components/workbench";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { author, elysia, hoyoverse, playground } from "@/app/samples";

export default function Home() {
  const [codebase, setCodebase] = useState({
    cursor: 0,
    name: ["hoyoverse", "elysia", "playground", "author"],
    code: [hoyoverse, elysia, playground, author],
  });

  return (
    <>
      <Navbar codebase={codebase} setCodebase={setCodebase} />
      <Workbench codebase={codebase} setCodebase={setCodebase} />
      <Footer />
    </>
  );
}
