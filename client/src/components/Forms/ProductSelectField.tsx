import { useFieldContext } from "@/context/form-context";
import type { Products } from "@/utils/types";

import { cn } from "@sglara/cn";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../Products/ProductCard";
import Plus from "../Icons/Plus";
import ProductsModal from "../Products/ProductsModal";
import Reorder from "../Reorder";

const placeholderProduct = (index: number) => {
  return {
    created_at: new Date(),
    description: "placeholder",
    details: null,
    id: index.toString(),

    name: "placeholder",
    price: 0,
    quantity: null,
    user_id: null,
  };
};

const ProductSelectField = ({ label }: { label: string }) => {
  const [inputs, setInputs] = useState<Products[]>([]);
  const [index, setIndex] = useState<number>();
  const field = useFieldContext<Products[]>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    field.handleChange(inputs);
  }, [field, inputs]);

  useEffect(() => {
    const name = async () => {
      if (field.options.defaultValue) {
        setInputs(field.options.defaultValue);
      }
    };
    name();
    if (inputs.length < 4) {
      for (let index = inputs.length; inputs.length < 4; index++) {
        inputs.push(placeholderProduct(index));
      }
    }
  }, []);

  const handleremove = (index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1, placeholderProduct(index));
    setInputs(updatedInputs);
  };

  const handleAddProduct = (i: number) => {
    setModalOpen(true);
    setIndex(i);
  };
  useEffect(() => {
    const modal = modalRef.current;
    const modalProduct = document.querySelector("#modalProduct");
    if (!modal) {
      return;
    }
    if (modalOpen) {
      modal.showModal();
    }
    let time: ReturnType<typeof setTimeout>;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log(target);
      console.log(modalProduct);
      console.log(modalProduct?.contains(target));

      if (target === e.currentTarget || modalProduct?.contains(target)) {
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

        <div className=" grid justify-between grid-cols-4 w-full gap-4 h-full group relative border border-black p-3">
          {inputs.length > 0 &&
            inputs.map((inp, i) =>
              inp.name !== "placeholder" ? (
                <div className="flex flex-col w-full h-full m-2 relative  ">
                  <ProductCard key={inp.id} product={inp} />
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
                  onClick={() => handleAddProduct(i)}
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
          <ProductsModal index={index || 0} inputs={inputs} />
        </dialog>
      )}
    </>
  );
};

export default ProductSelectField;
