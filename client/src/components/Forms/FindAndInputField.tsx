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
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number>(0);
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
      const res = await fetchCategories({ q: target.value });
      if (res) {
        setDataList(() =>
          res.results.filter(
            (x) => !inputs.some((item) => item.name === x.name),
          ),
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
        !inputs.some(
          (x) => x.name.toLowerCase() == entry.value.trim().toLowerCase(),
        ) &&
        !dataList.some(
          (x) => x.name.toLowerCase() == entry.value.trim().toLowerCase(),
        )
      ) {
        console.log("first");
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
        const existingInput = dataList.find(
          (x) => x.name.toLowerCase() == entry.value.trim().toLowerCase(),
        );
        console.log("existing", existingInput);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedMenuIndex === 0) {
        handleNew();
      } else {
        handleClick(dataList[focusedMenuIndex - 1]);
      }
      setDataList([]);
      setIsMenuOpen(false);
      setEntryState("");
      setFocusedMenuIndex(0);
    }
    const menu = menuRef.current?.children;
    if (e.key === "ArrowDown" && menu) {
      setFocusedMenuIndex((prev) =>
        focusedMenuIndex === menu.length - 1 ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp" && menu) {
      setFocusedMenuIndex((prev) =>
        focusedMenuIndex === 0 ? menu.length - 1 : prev - 1,
      );
    } else if (e.key === "Escape") {
      setIsMenuOpen(false);
      setFocusedMenuIndex(0);
    }
  };

  return (
    <div className="flex flex-col max-w-[400px] relative">
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
            onKeyDown={handleKeyDown}
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
            "hidden absolute top-28 z-50 left-4 w-full rounded-md overflow-y-scroll max-h-[200px] **:hover:bg-neutral-700 **:border-b **:border-b-neutral-500 **:cursor-pointer bg-neutral-800 px-2 border border-neutral-500 drop-shadow-xl drop-shadow-black **:px-4 **:py-2  flex-col",
            isMenuOpen && "flex",
          )}
          ref={menuRef}
        >
          {loading ? (
            <div>loading...</div>
          ) : (
            <>
              <div
                onClick={handleNew}
                className={cn(
                  focusedMenuIndex === 0
                    ? " !border-b-2 border-b-neutral-300! bg-neutral-600 rounded-t-md "
                    : "",
                )}
              >
                Create New: {entryState}
              </div>
              {dataList.map((item, index) => (
                <div
                  key={item.name}
                  onClick={() => handleClick(item)}
                  className={cn(
                    "  w-full",
                    focusedMenuIndex === index + 1 &&
                      "!border-b-2 border-b-neutral-300! bg-neutral-600 rounded-t-md ",
                  )}
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
