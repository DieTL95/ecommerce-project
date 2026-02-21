import type { Products } from "@/utils/types";
import ProductsRow from "../Products/ProductsRow";

const LanderProducts = ({ products }: { products: Products[] }) => {
  return <ProductsRow products={products} />;
};

export default LanderProducts;
