"use client";
import { Codebase } from "@/app/page";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Dispatch, SetStateAction, useCallback } from "react";

interface Props {
  codebase: Codebase;
  setCodebase: Dispatch<SetStateAction<Codebase>>;
}

export default function Workbench({ codebase, setCodebase }: Props) {
  const program = codebase.programs[codebase.cursor];

  return (
    <div className="flex h-[calc(100vh-45px)]">
      <div className="hidden w-1/5 lg:block border-e border-black overflow-auto">
        <ul>
          {codebase.programs.map((value, key) => (
            <li key={key}>
              <button
                className={`py-2 px-4 w-full text-start hover:cursor-pointer hover:bg-neutral-800 ${
                  codebase.cursor === key ? "bg-neutral-800" : ""
                }`}
                onClick={() => setCodebase((cb) => ({ ...cb, cursor: key }))}
              >
                {value.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full lg:w-4/5 relative">
        <VSEditor codebase={codebase} setCodebase={setCodebase} />
        <div className="h-[30vh] w-full absolute z-20 bottom-0 bg-neutral-900 border-t border-black p-3 flex flex-col">
          <div>
            <code className="font-bold">
              Felys v{process.env.NEXT_PUBLIC_BUILD_DATE} on WASM
            </code>
          </div>
          {program.outcome && (
            <div className="flex-1 overflow-auto mt-4">
              {program.outcome.stdout && (
                <div className="whitespace-pre-wrap">
                  <code>{program.outcome.stdout}</code>
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {program.outcome.success ? (
                  <code>
                    <b className="text-pink">Exit: </b>
                    {program.outcome.result}
                  </code>
                ) : (
                  <code className="text-red-400">{program.outcome.result}</code>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VSEditor({ codebase, setCodebase }: Props) {
  const program = codebase.programs[codebase.cursor];
  const handleCodeChange = useCallback(
    (newCode: string | undefined) => {
      if (newCode === undefined || newCode === program.code) {
        return;
      }

      setCodebase((prev) => ({
        ...prev,
        programs: prev.programs.map((x, i) =>
          i === prev.cursor ? { ...x, code: newCode, binary: undefined } : x,
        ),
      }));
    },
    [program.code, setCodebase],
  );

  return (
    <Editor
      options={{
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollbar: { horizontal: "hidden" },
      }}
      defaultLanguage="felys"
      loading={<div className="vscode-loader mb-[30vh]" />}
      onMount={config}
      value={program.code}
      onChange={handleCodeChange}
    />
  );
}

const config = (_: editor.IStandaloneCodeEditor, monaco: Monaco) => {
  monaco.languages.register({ id: "felys" });

  monaco.languages.setMonarchTokensProvider("felys", {
    tokenizer: {
      root: [
        [/(elysia|cyrene)/, "pink"],
        [/\/\/[^\n]*/, "comment"],
        [
          /(fn|group|impl|if|else|while|break|continue|loop|return|true|false|not|and|or|for|in)(?!\w)/,
          "keyword",
        ],
        [/[a-zA-Z_][\w_]*(?=\s*\()/, "function.call"],
        [/[a-zA-Z_][\w_]*/, "identifier"],
        [/\d+/, "number"],
        [/"/, "string", "@string"],
      ],
      string: [
        [/[^"]+/, "string"],
        [/"/, "string", "@pop"],
      ],
    },
  });

  monaco.editor.defineTheme("felys-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "pink", foreground: "#ffc6f5" },
      { token: "identifier", foreground: "#9cdcfe" },
      { token: "function.call", foreground: "#dcdcaa" },
    ],
    colors: {
      "editor.background": "#171717",
    },
  });

  monaco.editor.setTheme("felys-dark");
};
