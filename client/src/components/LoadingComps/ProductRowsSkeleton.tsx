import ProductsRow from "../Products/ProductsRow";
import MainWrapper from "../UI/MainWrapper";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductRowsSkeleton = ({ numOfCards }: { numOfCards: number }) => {
  return (
    <MainWrapper>
      <ProductsRow>
        {Array(numOfCards)
          .fill(1)
          .map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
      </ProductsRow>
    </MainWrapper>
  );
};

export default ProductRowsSkeleton;
