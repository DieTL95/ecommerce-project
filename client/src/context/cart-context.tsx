import {
  addToCartAction,
  clearCartAction,
  createCartAction,
  deleteCartItemAction,
  handleCartAction,
  updateCartAction,
} from "@/utils/actions";
import type { Cart, CartContextType, Products } from "@/utils/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import toast from "react-hot-toast";

const cartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | undefined>();
  const [loading, setLoading] = useState(false);
  const { user, getUser } = useAuth();
  const handleCart = useCallback(async () => {
    const res = await handleCartAction();
    setCart(res);
  }, []);

  if (user && !cart) {
    handleCart();
  }
  if (!cart) {
    console.log("hello");
  }

  const sum = useMemo(() => {
    if (cart && cart.cart_items && cart.cart_items?.length > 0) {
      return cart.cart_items
        .map((item) => {
          if (item.quantity !== null) {
            return item.quantity;
          }
        })
        .reduce((a, b) => {
          if (a && b) {
            return a + b;
          }
        });
    }
  }, [cart]);

  const addToCart = async (quantity: number, product: Products) => {
    setLoading(true);
    if (!user?.cart_id) {
      const cartRes = await createCartAction();

      const res = await addToCartAction(cartRes.id, quantity, product);
      if (res) {
        handleCart();
      }
      getUser();
      setLoading(false);
      return;
    }

    const res = await addToCartAction(user.cart_id, quantity, product);
    if (res) {
      handleCart();
    }
    setLoading(false);
  };

  const updateCart = async (quantity: number, productId: string) => {
    if (!cart || !user) {
      return;
    }
    setLoading(true);

    const res = await updateCartAction({
      cart_id: user.cart_id,
      productId,
      quantity,
    });
    if (!res?.error) {
      const updatedCartItems = cart.cart_items?.map((item) => {
        return item.product.id === productId ? { ...item, quantity } : item;
      });
      const updatedCart = { ...cart, cart_items: updatedCartItems };

      setCart(updatedCart);
    }
    handleCart();

    setLoading(false);
  };

  const incrementCart = async (currentQuantity: number, productId: string) => {
    await updateCart(currentQuantity + 1, productId);
  };

  const decrementCart = async (currentQuantity: number, productId: string) => {
    if (currentQuantity > 1) {
      await updateCart(currentQuantity - 1, productId);
    } else if (currentQuantity === 1) {
      deleteCartItem(productId);
    }
  };

  const deleteCartItem = async (id: string, name?: string) => {
    setLoading(true);

    const res = await deleteCartItemAction(id);
    if (!res?.error) {
      handleCart();
      if (name) {
        toast(`${name} has been removed from your cart.`);
      }
    }

    setLoading(false);
  };

  const clearCart = async (id: string) => {
    if (!cart) {
      return;
    }
    setLoading(true);

    const res = await clearCartAction(id);
    if (!res?.error) {
      handleCart();
    }
    setLoading(false);
  };

  return (
    <cartContext.Provider
      value={{
        handleCart,
        cart,
        loading,
        sum,
        addToCart,
        incrementCart,
        decrementCart,
        clearCart,
        deleteCartItem,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error("Must use useCart within CartContext Provider.");
  }
  return context;
};
