import type { Products } from "@/utils/types";
import { dollarsPrice } from "@/utils/utils";
import ProductThumbnail from "../UI/ProductThumbnail";

const ProductCard = ({ product }: { product: Products }) => {
  return (
    <div className=" w-full h-full min-h-[150px]">
      <div className="flex flex-col place-content-between items-center h-full w-full">
        <div className=" h-full">
          {product.images && product.images.length > 0 && (
            <div className="object-fill h-full">
              <ProductThumbnail imageId={product.images[0].public_id} />
            </div>
          )}
        </div>
        <div className="flex flex-row gap-4">
          <div>{product.name}</div>
          <span>{dollarsPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
