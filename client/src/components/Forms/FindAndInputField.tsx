import { useFieldContext } from "@/context/form-context";
import type { Categories } from "@/utils/types";
import { capitalizeFirstLetter, debounce } from "@/utils/utils";
import { fetchCategories } from "@/zactions/catgeoriesActions";
import { cn } from "@sglara/cn";
import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  props?: React.ComponentProps<"input">;
};

const FindAndInputField = ({ label, props }: Props) => {
  const [inputs, setInputs] = useState<{ name: string; id?: string }[]>([]);
  const [dataList, setDataList] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [entryState, setEntryState] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<HTMLInputElement>(null);
  const field = useFieldContext<{ name: string; id?: string }[]>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (item: any) => {
    const entry = entryRef.current;

    setInputs((prev) => [...prev, item]);
    if (entry) {
      entry.value = "";
    }
  };

  const handleremove = (index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setEntryState(target.value);
    setLoading(true);
    setIsMenuOpen(true);
    if (target.value === "" || target.value === "undefined") {
      setDataList([]);
      setIsMenuOpen(false);
      setEntryState("");
    } else {
      const res = await fetchCategories(target.value);
      if (res) {
        setDataList(() =>
          res.filter((x) => !inputs.some((item) => item.name === x.name)),
        );
      }
    }
    setLoading(false);
  };

  const handleNew = () => {
    const entry = entryRef.current;
    console.log(entry?.value);
    if (entry?.value) {
      if (
        !inputs.some((x) => x.name === entry.value) &&
        !dataList.some((x) => x.name === entry.value)
      ) {
        setInputs((prev) => [
          ...prev,
          {
            name: capitalizeFirstLetter(
              entryState?.toLowerCase().trim() as string,
            ),
          },
        ]);
        entry.value = "";
      } else {
        const existingInput = dataList.find((x) => x.name === entry.value);
        if (existingInput) {
          setInputs((prev) => [
            ...prev,
            { name: existingInput.name, id: existingInput.id },
          ]);
          entry.value = "";
        }
      }
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = menuRef.current;
      if (!menu?.contains(target)) {
        setIsMenuOpen(false);
      }

      if (menu?.contains(target)) {
        setTimeout(() => {
          setIsMenuOpen(false);
        }, 500);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuRef]);

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
  }, []);
  return (
    <div className="flex flex-col max-w-[400px]  p-4 relative">
      {field.state.meta.errors.length > 0 && (
        <em role="alert" className="mt-2">
          {field.state.meta.errors.map((error, index) => (
            <em className="text-red-500" key={index}>
              {error?.message}
            </em>
          ))}
        </em>
      )}
      <div className="flex flex-row w-full flex-wrap group border border-black px-4 py-3.5  relative">
        {inputs.length > 0 &&
          inputs.map((inp, index) => (
            <div
              className="w-fit h-fit m-2 px-4 py-2 relative  bg-neutral-500"
              key={index}
            >
              <span>{inp.name}</span>
              <button
                type="button"
                className="absolute -top-2 right-0"
                onClick={() => handleremove(index)}
              >
                X
              </button>
            </div>
          ))}
        <div className="flex flex-col w-full">
          <input
            name={field.name}
            type="text"
            id={field.name}
            placeholder=" "
            ref={entryRef}
            onChange={debounce(handleChange, 500)}
            autoComplete="off"
            className={cn(" w-full h-full")}
            {...props}
          />
          <label
            className={cn(
              "group absolute top-[7px] left-[14px] px-1 py-1  transition-all ease-initial duration-250",
              inputs.length > 0 && "populatedTags",
            )}
            htmlFor={field.name}
          >
            {label}
          </label>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={cn(
            "hidden absolute -bottom-6 left-4 w-full overflow-y-scroll max-h-[200px] **:odd:bg-neutral-800 **:even:bg-neutral-600 bg-neutral-600 border border-neutral-400 **:px-4 **:py-2  flex-col",
            isMenuOpen && "flex",
          )}
          ref={menuRef}
        >
          {loading ? (
            <div>loading...</div>
          ) : (
            <>
              <div onClick={handleNew}>Create new: {entryState}</div>
              {dataList.map((item) => (
                <div
                  key={item.name}
                  onClick={() => handleClick(item)}
                  className=" cursor-pointer  w-full"
                >
                  {item.name}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAndInputField;
