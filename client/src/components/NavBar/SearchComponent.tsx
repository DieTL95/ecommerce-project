import type { Products } from "@/utils/types";
import { debounce, dollarsPrice } from "@/utils/utils";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import TextInput from "../UI/TextInput";
import ProductThumbnail from "../UI/ProductThumbnail";
import { cn } from "@sglara/cn";
import { useNavigate } from "@tanstack/react-router";
import { fetchProducts } from "@/zactions/productActions";

const SearchComponent = () => {
  const [products, setProducts] = useState<Products[]>();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState<string | undefined>();
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === "" || value === undefined || !value) {
      setProducts([]);
      setIsMenuOpen(false);
      setLoading(false);
      return;
    } else {
      setIsMenuOpen(true);
      setQuery(value);
    }
  };

  const handleInputClick = () => {
    if (query) {
      return setIsMenuOpen(true);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({ to: "/search", search: { q: query } });
      setProducts([]);
      setIsMenuOpen(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      if (query) {
        setLoading(true);
        const data = await fetchProducts({ q: query?.trim() });
        if (data) {
          setProducts(data.results);
          setIsMenuOpen(true);
        }
        setLoading(false);
      }
    };

    getProducts();
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = menuRef.current;

      if (!menu?.contains(target)) {
        setIsMenuOpen(false);
      }

      if (menu?.contains(target) && target.tagName === "A") {
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

  console.log(query);
  return (
    <div className="w-[700px] rounded relative ">
      <TextInput
        label="Search Products"
        props={{
          onChange: debounce(handleSearch),
          onClick: handleInputClick,
          autoFocus: false,
          onKeyDown: handleKey,
        }}
      />
      {isMenuOpen && (
        <div
          className={cn(
            "hidden absolute bg-black/80 top-10 z-50  w-full rounded-md overflow-hidden max-h-[500px]  px-2  drop-shadow-black  flex-col",
            isMenuOpen && "flex",
          )}
          ref={menuRef}
        >
          {loading ? (
            <div>loading...</div>
          ) : (
            products &&
            products?.length > 0 &&
            products.map((product) => (
              <div key={product.id} className="cursor-pointer w-full h-24 ">
                <div className="flex flex-row  items-center h-full w-full">
                  <div className=" h-full">
                    {product.images && product.images.length > 0 && (
                      <div className="object-fill h-full">
                        <ProductThumbnail
                          imageId={product.images[0].public_id}
                          height={60}
                          width={50}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>{product.name}</div>
                    <span>{dollarsPrice(product.price)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
