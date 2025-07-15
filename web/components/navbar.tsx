"use client";
import Link from "next/link";
import { CollectionIcon, ExecIcon } from "@/components/icons";
import { Codebase, SetCodebase, SetModal } from "@/components/alias";
import { useState } from "react";

interface Props {
  codebase: Codebase;
  setCodebase: SetCodebase;
}

export default function Navbar({ codebase, setCodebase }: Props) {
  const [modal, setModal] = useState(false);
  return (
    <header className="flex justify-between py-2 px-4 lg:px-6 border-b-1 border-black">
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
        <button className="lg:hidden z-40" onClick={() => setModal((m) => !m)}>
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
      <Selector
        modal={modal}
        setModal={setModal}
        codebase={codebase}
        setCodebase={setCodebase}
      />
    </header>
  );
}

interface SelectorProps {
  modal: boolean;
  codebase: Codebase;
  setModal: SetModal;
  setCodebase: SetCodebase;
}

function Selector({ modal, setModal, codebase, setCodebase }: SelectorProps) {
  return (
    <dialog
      open={modal}
      className="h-screen w-screen bg-black/75 z-30 fixed top-0"
    >
      <div className="h-full flex justify-center items-center">
        <ul className="max-h-[60vh] w-64 space-y-4 overflow-auto">
          {codebase.programs.map((value, key) => (
            <li key={key} className="text-lg font-bold text-neutral-300">
              <button
                className={`p-2 w-full border-neutral-800 border-x-3 bg-neutral-${
                  codebase.cursor === key ? "800" : "900"
                }`}
                onClick={() => {
                  setCodebase((cb) => ({ ...cb, cursor: key }));
                  setModal(false);
                }}
              >
                {value.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
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
          stderr: "no network connection",
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
          stderr: "timeout",
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
          stderr: "unknown",
        },
      };
      return { ...cb, programs: updatedPrograms };
    });
  }
};
