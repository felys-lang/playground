"use client";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Codebase, SetCodebase } from "./alias";

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

interface Props {
  codebase: Codebase;
  setCodebase: SetCodebase;
}

export default function Workbench({ codebase, setCodebase }: Props) {
  return (
    <div className="flex h-[calc(100vh-62px)]">
      <div className="hidden w-1/5 lg:block border-e-1 border-black overflow-auto">
        <ul>
          {codebase.name.map((value, key) => (
            <li key={key}>
              <button
                className={`py-2 px-4 w-full text-start${
                  codebase.cursor === key ? " bg-neutral-800" : ""
                }`}
                onClick={() => setCodebase((cb) => ({ ...cb, cursor: key }))}
              >
                {value}.ely
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full lg:w-4/5">
        <Editor
          options={{
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollbar: { horizontal: "hidden" },
          }}
          defaultLanguage="felys"
          loading={<div className="loader" />}
          onMount={config}
          value={codebase.code[codebase.cursor]}
          onChange={(c) =>
            setCodebase((cb) => {
              cb.code[cb.cursor] = c || "";
              return { ...cb, code: cb.code };
            })
          }
        />
      </div>
    </div>
  );
}
