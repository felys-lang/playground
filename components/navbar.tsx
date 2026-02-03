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
  useMemo,
  useRef,
  useState,
} from "react";

interface Props {
  codebase: Codebase;
  setCodebase: Dispatch<SetStateAction<Codebase>>;
}

export default function Navbar({ codebase, setCodebase }: Props) {
  const [modal, setModal] = useState(false);
  const program = codebase.programs[codebase.cursor];

  const [isCompiling, setIsCompiling] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const compileWorkerRef = useRef<Worker | null>(null);
  const executeWorkerRef = useRef<Worker | null>(null);

  const handleCompile = useCallback(() => {
    if (isCompiling) return;

    if (compileWorkerRef.current) {
      compileWorkerRef.current.terminate();
    }

    const worker = new Worker(new URL("./workers/compile.ts", import.meta.url));
    compileWorkerRef.current = worker;
    setIsCompiling(true);

    const timeoutId = setTimeout(() => {
      worker.terminate();
      compileWorkerRef.current = null;
      setIsCompiling(false);

      const outcome = {
        stdout: "",
        result: "compiler timeout",
        success: false,
      };
      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor ? { ...x, outcome } : x,
        ),
      }));
    }, 2000);

    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();
      compileWorkerRef.current = null;
      setIsCompiling(false);

      const { binary, outcome } = e.data;

      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor ? { ...x, binary, outcome } : x,
        ),
      }));
    };

    worker.onerror = (e) => {
      setIsCompiling(false);
      worker.terminate();
    };

    worker.postMessage({ code: program.code, o: 1 });
  }, [isCompiling, program.code, setCodebase]);

  const handleExecute = useCallback(() => {
    if (isExecuting) return;

    if (executeWorkerRef.current) {
      executeWorkerRef.current.terminate();
    }

    const worker = new Worker(new URL("./workers/execute.ts", import.meta.url));
    executeWorkerRef.current = worker;
    setIsExecuting(true);

    const timeoutId = setTimeout(() => {
      worker.terminate();
      executeWorkerRef.current = null;
      setIsExecuting(false);

      const outcome = {
        stdout: "",
        result: "virtual machine timeout",
        success: false,
      };
      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor ? { ...x, outcome } : x,
        ),
      }));
    }, 5000);

    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();
      executeWorkerRef.current = null;
      setIsExecuting(false);

      const outcome = e.data;

      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor ? { ...x, outcome } : x,
        ),
      }));
    };

    worker.onerror = (e) => {
      setIsExecuting(false);
      worker.terminate();
    };

    worker.postMessage({ binary: program.binary });
  }, [isExecuting, program.binary, setCodebase]);

  const state = useMemo(() => {
    if (isCompiling || isExecuting) return "working";
    if (program.binary === undefined) return "compile";
    return "execute";
  }, [isCompiling, isExecuting, program.binary]);

  useEffect(() => {
    return () => {
      compileWorkerRef.current?.terminate();
      executeWorkerRef.current?.terminate();
    };
  }, []);

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
          className="lg:hidden z-40 hover:cursor-pointer"
          onClick={() => setModal((m) => !m)}
        >
          <CollectionIcon />
        </button>
        <div className="loader-container" key={state}>
          {state === "working" ? (
            <div className="loader" />
          ) : state === "compile" ? (
            <button className="hover:cursor-pointer" onClick={handleCompile}>
              <CompilationIcon />
            </button>
          ) : (
            <button className="hover:cursor-pointer" onClick={handleExecute}>
              <ExecuctionIcon />
            </button>
          )}
        </div>
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
