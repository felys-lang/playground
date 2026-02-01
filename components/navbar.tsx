"use client";
import Link from "next/link";
import {
  CollectionIcon,
  CompilationIcon,
  ExecuctionIcon,
} from "@/components/icons";
import { Codebase } from "@/app/page";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import init, { compile, execute } from "@/wasm/pkg";

interface Props {
  codebase: Codebase;
  setCodebase: Dispatch<SetStateAction<Codebase>>;
}

export default function Navbar({ codebase, setCodebase }: Props) {
  const program = codebase.programs[codebase.cursor];
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    init().then(() => {
      setIsReady(true);
    });
  }, []);

  const handleCompile = useCallback(() => {
    if (!isReady) {
      return;
    }
    try {
      const binary = compile(program.code, 0);
      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor ? { ...x, binary, outcome: undefined } : x,
        ),
      }));
    } catch (err) {
      const outcome = { stdout: "", result: String(err), success: false };
      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor
            ? {
                ...x,
                outcome,
              }
            : x,
        ),
      }));
    }
  }, [isReady, program.code, setCodebase]);

  const handleExecute = useCallback(() => {
    if (!program.binary) return;
    const outcome = execute(program.binary);
    setCodebase((prev) => ({
      ...prev,
      programs: prev.programs.map((x, i) =>
        i === prev.cursor ? { ...x, outcome } : x,
      ),
    }));
  }, [program.binary]);

  return (
    <header className="flex justify-between py-2 px-4 lg:px-6 border-b border-black">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">
          <Link href="/" className="text-pink">
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
        <button
          className="lg:hidden z-40"
          onClick={() => console.log("collection")}
        >
          <CollectionIcon />
        </button>
        {program.binary === undefined ? (
          <button className="hover:cursor-pointer" onClick={handleCompile}>
            <CompilationIcon />
          </button>
        ) : (
          <button className="hover:cursor-pointer" onClick={handleExecute}>
            <ExecuctionIcon />
          </button>
        )}
      </div>
    </header>
  );
}
