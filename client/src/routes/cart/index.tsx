import DeleteIcon from "@/components/Icons/DeleteIcon";
import Button from "@/components/UI/Button";
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
      <div className="flex flex-row gap-2">
        <div className="flex-4/5 w-full">
          {cart?.cart_items?.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-2xl border-gray-500/80 flex flex-row gap-2"
            >
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
              </Link>
              <div className="flex flex-row gap-4">
                <Link
                  to="/products/$product"
                  params={{ product: item.product.id }}
                >
                  <div>{item.product.name}</div>{" "}
                </Link>

                <div>{item.quantity}</div>
                <div>{dollarsPrice(item.total_price!)}</div>
                <Button
                  className="w-fit h-fit bg-black/0 hover:bg-black/50 p-2"
                  onClick={() => deleteCart(item.product.id)}
                >
                  <DeleteIcon />
                </Button>
              </div>
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
              <Button className="w-full my-2 py-2 bg-black text-white rounded-md cursor-pointer">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}
