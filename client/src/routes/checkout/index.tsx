import MainWrapper from "@/components/UI/MainWrapper";
import { fetchCartByIdAction } from "@/utils/actions";
import { fetchOneAddress } from "@/zactions/addressActions";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/Forms/CheckoutForm";
const checkoutSearchParams = z.object({
  cartId: z.uuidv4(),
  addId: z.uuidv4().optional(),
});

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_PUBLIC);

export const Route = createFileRoute("/checkout/")({
  component: RouteComponent,
  validateSearch: checkoutSearchParams,
  beforeLoad: ({ search, context: { auth } }) => {
    if (!search.cartId) {
      throw redirect({ to: "/cart" });
    }

    if (!auth.isAuthenticated && !search.addId) {
      throw redirect({
        to: "/account/address-book/new-address",
        search: (prev) => prev,
      });
    }

    if (auth.isAuthenticated && !auth.user?.default_address_id) {
      throw redirect({ to: "/account/address-book/new-address" });
    }
  },

  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ deps: { cartId, addId }, context: { auth } }) => {
    const cart = await fetchCartByIdAction(cartId);
    if (!cart || !cart.cart_items) {
      toast.error("Error fetching cart items.");
      throw notFound();
    }

    if (!addId && !auth.user?.default_address_id) {
      throw notFound();
    }

    const address = await fetchOneAddress(
      addId || (auth.user?.default_address_id as string),
    );
    return { cart, address };
  },
  notFoundComponent: () => redirect({ to: "/cart", throw: true }),
});

function RouteComponent() {
  const [clientSecret, setClientSecret] = useState("");

  const { cart, address } = Route.useLoaderData();
  const { addId } = Route.useSearch();
  const {
    auth: { user },
  } = Route.useRouteContext();

  if (!cart.cart_items) {
    return;
  }
  const val = cart.cart_items
    .map((item) => item.total_price)
    .reduce((a, b) => a && b && a + b);

  const user_id = user?.id;
  const order_items = cart.cart_items.map((item) => {
    return {
      product_id: item.product.id,
      price: item.price!,
      quantity: item.quantity!,
    };
  });
  console.log("order items : ", order_items);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/checkout/payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: val }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <MainWrapper>
      {/* <div className="flex flex-col w-full">
        <div className="flex flex-col gap-2 p-4 border border-gray-500/70 rounded-2xl">
          <span className="font-bold text-xl">{address?.label}</span>
          <div className="grid grid-cols-3">
            <span>{address?.address_one}</span>
            <span>{address?.address_two}</span>
            <span>{address?.city}</span>
            <span>{address?.province}</span>
            <span>{address?.zipcode}</span>
            <span>{address?.phonenumber}</span>
          </div>
        </div> */}

      <div className="flex flex-row w-full">
        <div className="flex-4/5 w-full flex-col">
          <div className="flex flex-col w-full">
            <div className="w-fit flex flex-col gap-2 p-4 border border-gray-500/70 rounded-2xl">
              <span className="font-bold text-xl">{address?.label}</span>
              <div className="grid grid-cols-3">
                <span>{address?.address_one}</span>
                <span>{address?.address_two}</span>
                <span>{address?.city}</span>
                <span>{address?.province}</span>
                <span>{address?.zipcode}</span>
                <span>{address?.phonenumber}</span>
              </div>
            </div>
          </div>
          {cart.cart_items.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div>{item.product.name}</div>
              <div className="flex-row flex">
                <span>{item.quantity}</span> - <span>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1/5">
          {clientSecret && (
            <div>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "night" },
                  loader: "auto",
                }}
              >
                <CheckoutForm
                  address_id={addId}
                  order_items={order_items}
                  user_id={user_id}
                  value={val}
                />
              </Elements>
            </div>
          )}
          {/* <button
            disabled={loading}
            type="button"
            className={cn(
              "w-full my-2 py-2 bg-black text-white rounded-md cursor-pointer",
              loading && "cursor-wait",
            )}
            onClick={handleOrder}
          >
            Create Order
          </button> */}
        </div>
      </div>
      {/* </div> */}
    </MainWrapper>
  );
}
