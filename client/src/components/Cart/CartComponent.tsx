import { useCart } from "@/context/cart-context";
import CartIcon from "../UI/CartIcon";
const CartComponent = () => {
  const { sum } = useCart();
  return (
    <div className="flex relative">
      <CartIcon />
      {sum}
    </div>
  );
};

export default CartComponent;
