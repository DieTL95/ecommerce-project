import type { Products } from "@/utils/types";

import ProductCard from "./ProductCard";
import { debounce } from "@/utils/utils";
import { useEffect, useState, type ChangeEvent } from "react";
import TextInput from "../UI/TextInput";
import { fetchProducts } from "@/zactions/productActions";

const ProductsModal = ({
  index,
  inputs,
}: {
  index: number;
  inputs: Products[];
}) => {
  const [products, setProducts] = useState<Products[]>();
  const [query, setQuery] = useState<string | undefined>();

  const addProdHandler = (product: Products) => {
    inputs.splice(index, 1, product);
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts({ query: query?.trim() });
      if (data) {
        setProducts(data.results);
      }
    };

    getProducts();
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
          id="modalProduct"
        >
          {products &&
            products?.length > 0 &&
            products
              .filter((x) => !inputs.some((d) => d.id === x.id))
              .map((product) => (
                <div
                  key={product.id}
                  onClick={() => addProdHandler(product)}
                  className="cursor-pointer"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsModal;
