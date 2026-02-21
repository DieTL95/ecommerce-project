import type { Products } from "@/utils/types";
import ProductCard from "./ProductCard";

const ProductsRow = ({
  products,
  children,
}: {
  products?: Products[];
  children?: React.ReactNode;
}) => {
  return (
    <div className="w-full my-2 h-full">
      <div className="grid w-full justify-between grid-cols-4 gap-2 h-full relative">
        {products
          ? products.map((prod) => <ProductCard product={prod} />)
          : children}
      </div>
    </div>
  );
};

export default ProductsRow;
