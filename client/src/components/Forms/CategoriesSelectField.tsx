import { useFieldContext } from "@/context/form-context";
import type { Categories } from "@/utils/types";

import { cn } from "@sglara/cn";
import { useEffect, useRef, useState } from "react";
import Plus from "../Icons/Plus";
import Reorder from "../Reorder";
import CategoriesModal from "../Categories/CategoriesModal";

const placeholderCategory = (index: number) => {
  return {
    created_at: new Date(),
    description: "placeholder",
    details: null,
    id: index.toString(),
    images: null,
    products: [],
    name: "placeholder",
    user_id: null,
  };
};

const CategoriesSelectField = ({ label }: { label: string }) => {
  const [inputs, setInputs] = useState<Categories[]>([]);
  const [index, setIndex] = useState<number>();
  const field = useFieldContext<Categories[]>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const name = async () => {
      if (field.options.defaultValue) {
        setInputs(field.options.defaultValue);
      }
    };
    name();
  }, []);

  if (inputs.length < 4) {
    for (let index = inputs.length; inputs.length < 4; index++) {
      inputs.push(placeholderCategory(index));
    }
  }
  useEffect(() => {
    field.handleChange(inputs);
  }, [field, inputs]);

  const handleremove = (index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1, placeholderCategory(index));
    setInputs(updatedInputs);
  };

  const handleAddCategory = (i: number) => {
    setModalOpen(true);
    setIndex(i);
  };
  useEffect(() => {
    const modal = modalRef.current;
    const modalCategory = document.querySelector("#modalCategory");
    if (!modal) {
      return;
    }
    if (modalOpen) {
      modal.showModal();
    }
    let time: ReturnType<typeof setTimeout>;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target === e.currentTarget || modalCategory?.contains(target)) {
        time = setTimeout(() => {
          modal.close();
          setModalOpen(false);
        }, 200);
      }
    };
    const handleClose = () => {
      setModalOpen(false);
    };
    modal.addEventListener("click", handleClick);
    modal.addEventListener("close", handleClose);

    return () => {
      modal.removeEventListener("click", handleClick);
      modal.removeEventListener("close", handleClose);
      return clearTimeout(time);
    };
  }, [modalRef, modalOpen]);

  return (
    <>
      <div className="flex flex-col w-full relative">
        {field.state.meta.errors.length > 0 && (
          <em role="alert" className="mt-2">
            {field.state.meta.errors.map((error, i) => (
              <em className="text-red-500" key={i}>
                {error?.message}
              </em>
            ))}
          </em>
        )}
        <div className="flex flex-row w-full gap-4  group relative border border-black p-3">
          {inputs.length > 0 &&
            inputs.map((inp, i) =>
              inp.name !== "placeholder" ? (
                <div className="max-w-[243px] h-full  m-2 relative  ">
                  <div key={inp.id} className="bg-black/60 w-full h-full ">
                    <div className=" h-full overflow-hidden relative">
                      <img
                        src={inp.images?.[0].secure_url}
                        alt={inp.name}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <span className="absolute text-white bottom-0">
                        {inp.name}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 right-0"
                    onClick={() => handleremove(i)}
                  >
                    X
                  </button>
                  <Reorder list={inputs} setList={setInputs} index={i} />
                </div>
              ) : (
                <div
                  className="w-full h-[200px] m-2 relative cursor-pointer"
                  onClick={() => handleAddCategory(i)}
                  key={i}
                >
                  <div className="bg-black w-full h-full ">
                    <div className="hover:bg-neutral-700 bg-neutral-600 group/item h-full w-full flex items-center justify-center">
                      <Plus className=" text-neutral-300 group-hover/item:text-neutral-400" />
                    </div>
                  </div>
                </div>
              ),
            )}
          <div
            className={cn(
              "group absolute  listLabel px-1 py-1 transition-all ease-initial duration-250",
            )}
          >
            {label}
          </div>
        </div>
      </div>
      {modalOpen && (
        <dialog
          ref={modalRef}
          className="backdrop:bg-black/70 bg-black/10   flex  justify-center items-center  w-full h-full"
        >
          <CategoriesModal index={index || 0} inputs={inputs} />
        </dialog>
      )}
    </>
  );
};

export default CategoriesSelectField;
