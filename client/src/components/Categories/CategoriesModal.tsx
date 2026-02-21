import type { Categories } from "@/utils/types";

import { debounce } from "@/utils/utils";
import { useEffect, useState, type ChangeEvent } from "react";
import TextInput from "../UI/TextInput";
import { fetchCategories } from "@/zactions/catgeoriesActions";
import CategoriesCard from "./CategoriesCard";

const CategoriesModal = ({
  index,
  inputs,
}: {
  index: number;
  inputs: Categories[];
}) => {
  const [categories, setCategories] = useState<Categories[]>();
  const [query, setQuery] = useState<string | undefined>();

  const addCatgHandler = (category: Categories) => {
    inputs.splice(index, 1, category);
  };

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories(query?.trim());
      if (data) {
        setCategories(data);
      }
    };

    getCategories();
  }, [query]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <div className="flex flex-col justify-center items-center w-1/3 gap-2 h-fit p-2 rounded-xl bg-neutral-900">
      <div className="w-full">
        <TextInput
          label="Search Products"
          props={{ onChange: debounce(handleSearch) }}
        />
      </div>
      <div className="w-full my-2 h-fit">
        <div
          className=" w-full  grid-cols-4 grid gap-2 h-full"
          id="modalCategory"
        >
          {categories &&
            categories?.length > 0 &&
            categories.map((category) => (
              <div
                key={category.id}
                onClick={() => addCatgHandler(category)}
                className="cursor-pointer"
              >
                <CategoriesCard category={category} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;
