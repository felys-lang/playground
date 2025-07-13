"use client";
import Link from "next/link";
import { CollectionIcon, ExecIcon } from "@/components/icons";
import { Codebase, Result, SetCodebase, SetResult } from "@/components/alias";
import { useState } from "react";
import Terminal from "@/components/terminal";
import Selector from "@/components/selector";

interface Props {
  codebase: Codebase;
  setCodebase: SetCodebase;
}

export default function Navbar({ codebase, setCodebase }: Props) {
  const [modal, setModal] = useState(false);
  const [result, setResult] = useState<Result | undefined>(undefined);

  return (
    <header className="flex justify-between py-4 px-4 lg:px-6 border-b-2 border-black">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">
          <Link href="/" className="text-elysia">
            Felys
          </Link>
        </h1>
        <Link
          href="https://github.com/felys-lang/felys"
          target="_blank"
          className="font-medium"
        >
          GitHub
        </Link>
        <Link href="https://felys.dev" target="_blank" className="font-medium">
          Docs
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button className="lg:hidden" onClick={() => setModal((m) => !m)}>
          <CollectionIcon />
        </button>
        <button
          onClick={() => executeCode(codebase.code[codebase.cursor], setResult)}
        >
          <ExecIcon />
        </button>
      </div>
      <Selector
        modal={modal}
        setModal={setModal}
        codebase={codebase}
        setCodebase={setCodebase}
      />
      <Terminal result={result} setResult={setResult} />
    </header>
  );
}

const executeCode = async (code: string, setResult: SetResult) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/execute`, {
    method: "POST",
    body: JSON.stringify({ code: code, params: {} }),
  }).catch((e) => console.log(e));

  if (!response) {
    setResult({ params: "", stdout: [], stderr: "no connection" });
    return;
  }

  if (response.ok) {
    const result = await response.json();
    setResult(result);
  } else if (response.status == 504) {
    setResult({ params: "", stdout: [], stderr: "timeout" });
  } else {
    setResult({ params: "", stdout: [], stderr: "unknown error" });
  }
};
