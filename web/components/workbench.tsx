"use client";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Codebase, SetCodebase } from "./alias";
import { LockIcon } from "./icons";

interface Props {
  codebase: Codebase;
  setCodebase: SetCodebase;
}

export default function Workbench({ codebase, setCodebase }: Props) {
  const program = codebase.programs[codebase.cursor];
  return (
    <div className="flex h-[calc(100vh-62px)]">
      <div className="hidden w-1/5 lg:block border-e-1 border-black overflow-auto">
        <ul>
          {codebase.programs.map((value, key) => (
            <li key={key}>
              <button
                className={`py-2 px-4 w-full text-start hover:bg-neutral-800 ${
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
        <Editor
          options={{
            readOnly: program.locked,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollbar: { horizontal: "hidden" },
          }}
          defaultLanguage="felys"
          loading={<div className="loader" />}
          onMount={config}
          value={program.code}
          onChange={(newCode) =>
            setCodebase((cb) => {
              if (newCode === undefined) return cb;
              const updatedPrograms = [...cb.programs];
              updatedPrograms[cb.cursor] = {
                ...updatedPrograms[cb.cursor],
                code: newCode,
              };
              return { ...cb, programs: updatedPrograms };
            })
          }
        />
        <div className="h-[30vh] w-full absolute bottom-0 z-20 bg-neutral-900 border-t-1 border-black p-3 overflow-auto">
          <div className="flex justify-between items-center">
            <code className="font-bold">Felys v0.4.0</code>
            <button
              onClick={() =>
                setCodebase((cb) => {
                  const updatedPrograms = [...cb.programs];
                  updatedPrograms[cb.cursor] = {
                    ...updatedPrograms[cb.cursor],
                    locked: true,
                  };
                  return { ...cb, programs: updatedPrograms };
                })
              }
            >
              <LockIcon />
            </button>
          </div>
          <br />
          <div className="whitespace-pre-wrap">
            <code>{program.output?.stdout.join("\n")}</code>
          </div>
          <div className="whitespace-pre-wrap text-red-500">
            <code>{program.output?.stderr}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

const config = (_: editor.IStandaloneCodeEditor, monaco: Monaco) => {
  monaco.languages.register({ id: "felys" });

  monaco.languages.setMonarchTokensProvider("felys", {
    tokenizer: {
      root: [
        [/__elysia__/, "elysia"],
        [/\/\/[^\n]*/, "comment"],
        [
          /if|else|while|break|continue|loop|return|true|rust|print|false|not|and|or|for|in|step|by(?!\w)/,
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
      { token: "elysia", foreground: "#ffc6f5" },
      { token: "identifier", foreground: "#9cdcfe" },
      { token: "function.call", foreground: "#dcdcaa" },
    ],
    colors: {
      "editor.background": "#171717",
    },
  });

  monaco.editor.setTheme("felys-dark");
};
