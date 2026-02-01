"use client";
import { Codebase } from "@/app/page";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Dispatch, SetStateAction } from "react";

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
        <VSEditor codebase={codebase} setCodebase={setCodebase} />
        <div className="h-[30vh] w-full absolute z-20 bottom-0 bg-neutral-900 border-t border-black p-3 flex flex-col">
          <div>
            <code className="font-bold">Felys v0.4.0</code>
          </div>
          {program.outcome && (
            <div className="flex-1 overflow-auto mt-4">
              {program.outcome?.stdout && (
                <div className="whitespace-pre-wrap">
                  <code>{program.outcome?.stdout}</code>
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {program.outcome?.success ? (
                  <code className="text-red-500">
                    {program.outcome?.reuslt}
                  </code>
                ) : (
                  <code>
                    <b className="text-elysia">Exit: </b>
                    {program.outcome?.reuslt}
                  </code>
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
  return (
    <Editor
      options={{
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
