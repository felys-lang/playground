import { CloseIcon } from "@/components/icons";
import { Result, SetResult } from "@/components/alias";

interface Props {
  result: Result | undefined;
  setResult: SetResult;
}

export default function Terminal({ result, setResult }: Props) {
  return (
    <dialog
      open={result !== undefined}
      className="max-h-[40vh] w-screen fixed bottom-0 z-10 p-4 overflow-auto text-neutral-300 bg-neutral-900 border-t-2 border-black"
    >
      <div className="flex justify-between items-center">
        <code className="font-bold">Felys 0.3.0</code>
        <button onClick={() => setResult(undefined)}>
          <CloseIcon />
        </button>
      </div>

      <br />

      <div className="whitespace-pre-wrap">
        <code>{result?.result}</code>
      </div>

      <br />

      <div className="whitespace-pre-wrap">
        <code>{`Finished in ${result?.elapsed}`}</code>
      </div>
    </dialog>
  );
}
