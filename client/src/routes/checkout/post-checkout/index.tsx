import LoadingPage from "@/components/UI/LoadingPage";
import MainWrapper from "@/components/UI/MainWrapper";
import { updateOrderStatusAction } from "@/zactions/orderActions";
import { useStripe } from "@stripe/react-stripe-js";
import type { PaymentIntent } from "@stripe/stripe-js/dist/api/payment-intents";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Search {
  search: {
    order_id?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string;
  };
}
export const Route = createFileRoute("/checkout/post-checkout/")({
  component: RouteComponent,
  beforeLoad: ({ search }: Search) => {
    const clientSecret = search.payment_intent_client_secret;
    if (!clientSecret) {
      throw notFound();
    }
  },
  context: ({ context: { cartContext } }) => cartContext,
  notFoundComponent: () => {
    <div>An error occured during payment.</div>;
  },
  loaderDeps: ({ search }: Search) => search,
  pendingComponent: () => <LoadingPage />,
  head: () => ({
    meta: [
      { name: "description", content: "Checkout-purchase result page." },
      { title: "Post-Checkout" },
    ],
  }),
});

function RouteComponent() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentIntent.Status>();
  const deps = Route.useLoaderDeps();
  const { clearCart, cart } = Route.useRouteContext();
  console.log(deps);
  const stripe = useStripe();

  useEffect(() => {
    if (!deps || !deps.order_id || !deps.payment_intent_client_secret) {
      throw notFound();
    }
    const getIntent = async () => {
      if (!stripe) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        deps.payment_intent_client_secret!,
      );

      console.log(paymentIntent);
      setPaymentStatus(paymentIntent?.status);

      if (paymentIntent?.status === "succeeded") {
        await updateOrderStatusAction(deps.order_id!, "paid");
        if (!cart) {
          return;
        }
        clearCart(cart.id);
      }
    };

    getIntent();
  }, [stripe]);

  const returendCase = () => {
    switch (paymentStatus) {
      case "succeeded":
        return <div>Thank you for your order. etc</div>;
      case "requires_payment_method":
        return <div>Payment not complete</div>;

      case "requires_confirmation":
        return <div>Please confirm payment and do what I dk</div>;

      case "processing":
        return <div>Payment is processing</div>;

      case "canceled":
        return <div>Payment was cancelled.</div>;

      default:
        return <div></div>;
    }
  };

  return <MainWrapper>{returendCase()}</MainWrapper>;
}
