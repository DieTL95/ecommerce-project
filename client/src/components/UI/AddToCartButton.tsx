import { useCart } from "@/context/cart-context";
import type { Products } from "@/utils/types";
import { useEffect, useState } from "react";
import CartButton from "./CartButton";

const AddToCartButton = ({ product }: { product: Products }) => {
  const [quantity, setQuantity] = useState<number>();
  const { cart, loading, addToCart, incrementCart, decrementCart } = useCart();
  useEffect(() => {
    cart?.cart_items?.forEach((item) => {
      if (item.product.id === product.id) {
        return setQuantity(item.quantity);
      }
    });
  }, [cart, product.id]);
  return (
    <div>
      {!quantity ? (
        <CartButton
          loading={loading}
          onClick={() => {
            addToCart(1, product);
          }}
          className="w-full rounded-xl bg-black text-md text-white py-2 cursor-pointer flex justify-center items-center hover:bg-white/20"
          label="Add To Cart"
        />
      ) : (
        <>
          <CartButton
            loading={loading}
            onClick={() => {
              decrementCart(quantity, product.id);
              if (quantity === 1) {
                setQuantity(undefined);
              }
            }}
            label="-"
          />

          {quantity}
          <CartButton
            loading={loading}
            onClick={() => {
              incrementCart(quantity, product.id);
            }}
            label="+"
          />
        </>
      )}
    </div>
  );
};

export default AddToCartButton;
