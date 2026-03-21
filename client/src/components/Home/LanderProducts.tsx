import type { Products } from "@/utils/types";
import ProductsRow from "../Products/ProductsRow";
import { Link } from "@tanstack/react-router";
import ProductCard from "../Products/ProductCard";

const LanderProducts = ({ products }: { products: Products[] }) => {
  return (
    <ProductsRow>
      {products.map((prod) => (
        <Link
          key={prod.id}
          to="/products/$product"
          params={{ product: prod.id }}
        >
          <ProductCard key={prod.id} product={prod} />
        </Link>
      ))}
    </ProductsRow>
  );
};

export default LanderProducts;
