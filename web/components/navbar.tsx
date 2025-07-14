"use client";
import Link from "next/link";
import { CollectionIcon, ExecIcon } from "@/components/icons";
import { Codebase, Output, SetCodebase } from "@/components/alias";

interface Props {
  codebase: Codebase;
  setCodebase: SetCodebase;
}

export default function Navbar({ codebase, setCodebase }: Props) {
  return (
    <header className="flex justify-between py-4 px-4 lg:px-6 border-b-1 border-black">
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
        <button className="lg:hidden">
          <CollectionIcon />
        </button>
        <button
          onClick={() => {
            setCodebase((cb) => {
              const updatedPrograms = [...cb.programs];
              updatedPrograms[cb.cursor] = {
                ...updatedPrograms[cb.cursor],
                output: {
                  ...updatedPrograms[cb.cursor].output,
                  params: {},
                },
              };
              return { ...cb, programs: updatedPrograms };
            });
            executeCode(codebase, setCodebase);
          }}
        >
          <ExecIcon />
        </button>
      </div>
    </header>
  );
}

const executeCode = async (codebase: Codebase, setCodebase: SetCodebase) => {
  const program = codebase.programs[codebase.cursor];
  const code = program.code;
  const params = program.locked ? program.output.params : {};
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/execute`, {
    method: "POST",
    body: JSON.stringify({ code, params }),
  }).catch((e) => console.log(e));

  if (!response) {
    setCodebase((cb) => {
      const updatedPrograms = [...cb.programs];
      updatedPrograms[cb.cursor] = {
        ...updatedPrograms[cb.cursor],
        output: {
          ...updatedPrograms[cb.cursor].output,
          stdout: [],
          stderr: "network error",
        },
      };
      return { ...cb, programs: updatedPrograms };
    });
    return;
  }

  if (response.ok) {
    const output = await response.json();
    setCodebase((cb) => {
      const updatedPrograms = [...cb.programs];
      updatedPrograms[cb.cursor] = {
        ...updatedPrograms[cb.cursor],
        output: output,
      };
      return { ...cb, programs: updatedPrograms };
    });
  } else if (response.status == 504) {
    setCodebase((cb) => {
      const updatedPrograms = [...cb.programs];
      updatedPrograms[cb.cursor] = {
        ...updatedPrograms[cb.cursor],
        output: {
          ...updatedPrograms[cb.cursor].output,
          stdout: [],
          stderr: "timeout error",
        },
      };
      return { ...cb, programs: updatedPrograms };
    });
  } else {
    setCodebase((cb) => {
      const updatedPrograms = [...cb.programs];
      updatedPrograms[cb.cursor] = {
        ...updatedPrograms[cb.cursor],
        output: {
          ...updatedPrograms[cb.cursor].output,
          stdout: [],
          stderr: "unknown error",
        },
      };
      return { ...cb, programs: updatedPrograms };
    });
  }
};
