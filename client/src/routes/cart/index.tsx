import MainWrapper from "@/components/UI/MainWrapper";
import { useCart } from "@/context/cart-context";
import { dollarsPrice } from "@/utils/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Cart page where you can see the products you have in your cart.",
      },
      { title: "Cart" },
    ],
  }),
});

const DeleteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-trash2-icon lucide-trash-2"
    >
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
};

function RouteComponent() {
  const { cart, deleteCart } = useCart();
  if (!cart || !cart.cart_items) {
    return (
      <MainWrapper>
        <div>Cart empty. Try adding items to your cart.</div>
      </MainWrapper>
    );
  }
  console.log(cart);
  return (
    <MainWrapper>
      <div className="flex flex-row">
        <div className="flex-4/5 w-full">
          {cart?.cart_items?.map((item) => (
            <div key={item.id} className="flex flex-row gap-2">
              <Link
                to="/products/$product"
                params={{ product: item.product.id }}
              >
                {item.product.images && item.product.images.length > 0 && (
                  <img
                    src={item.product.images[0].secure_url}
                    alt={item.product.name}
                    className="max-h-52"
                  />
                )}

                <div>{item.product.name}</div>
              </Link>
              <div>{item.quantity}</div>
              <div>{dollarsPrice(item.total_price!)}</div>
              <button onClick={() => deleteCart(item.product.id)}>
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
        <div className="flex-1/5 flex flex-col">
          <div className="mx-auto">
            Total:{" "}
            {cart.cart_items &&
              dollarsPrice(
                cart.cart_items
                  .map((item) => item.total_price)
                  .reduce((a, b) => a && b && a + b)!,
              )}
          </div>
          <div>
            <Link to="/checkout" search={() => ({ cartId: cart.id })}>
              <button
                type="button"
                className="w-full my-2 py-2 bg-black text-white rounded-md cursor-pointer"
              >
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}
