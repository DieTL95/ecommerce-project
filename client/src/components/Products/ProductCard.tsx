import type { Products } from "@/utils/types";
import { dollarsPrice } from "@/utils/utils";

const ProductCard = ({ product }: { product: Products }) => {
  return (
    <div className="bg-black w-full h-full min-h-[150px]">
      <div className="flex flex-col place-content-between items-center h-full w-full">
        <div className=" h-full">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0].url}
              alt={product.description}
              className="object-contain  h-full"
            />
          )}
        </div>
        <div>
          <div>{product.name}</div>
          <span>{dollarsPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
