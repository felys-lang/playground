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
  const [modal, setModal] = useState(false);
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
          i === prev.cursor ? { ...x, outcome } : x,
        ),
      }));
    }
  }, [isReady, program.code, setCodebase]);

  const handleExecute = useCallback(() => {
    if (!program.binary) return;
    let outcome = undefined;
    try {
      outcome = execute(program.binary);
    } catch (err) {
      outcome = { stdout: "", result: String(err), success: false };
    }
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
        <button className="lg:hidden z-40" onClick={() => setModal((m) => !m)}>
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
  setModal: Dispatch<SetStateAction<boolean>>;
  setCodebase: Dispatch<SetStateAction<Codebase>>;
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
