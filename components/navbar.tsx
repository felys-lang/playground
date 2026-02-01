"use client";
import Link from "next/link";
import {
  CollectionIcon,
  CompilationIcon,
  ExecuctionIcon,
} from "@/components/icons";
import { Codebase } from "@/app/page";
import { Dispatch, SetStateAction } from "react";

interface Props {
  codebase: Codebase;
  setCodebase: Dispatch<SetStateAction<Codebase>>;
}

export default function Navbar({ codebase, setCodebase }: Props) {
  const program = codebase.programs[codebase.cursor];

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
        {program.modified ? (
          <button
            className="hover:cursor-pointer"
            onClick={() => console.log("compile")}
          >
            <CompilationIcon />
          </button>
        ) : (
          <button
            className="hover:cursor-pointer"
            onClick={() => console.log("execute")}
          >
            <ExecuctionIcon />
          </button>
        )}
      </div>
    </header>
  );
}
