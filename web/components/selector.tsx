import { SetModal, Codebase, SetCodebase } from "@/components/alias";

interface Props {
  modal: boolean;
  setModal: SetModal;
  codebase: Codebase;
  setCodebase: SetCodebase;
}

export default function Selector({
  modal,
  setModal,
  codebase,
  setCodebase,
}: Props) {
  return (
    <dialog
      open={modal}
      className="h-screen w-screen fixed top-0 z-20 bg-black/50"
    >
      <div className="h-full flex justify-center items-center">
        <ul className="max-h-[60vh] w-64 space-y-4 overflow-auto">
          {codebase.name.map((value, key) => (
            <li key={key} className="text-lg font-bold text-neutral-300">
              <button
                className={`p-2 w-full border-neutral-300 border-x-2 bg-neutral-${
                  codebase.cursor === key ? "800" : "900"
                }`}
                onClick={() => {
                  setCodebase((cb) => ({ ...cb, cursor: key }));
                  setModal(false);
                }}
              >
                {value}.ely
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
