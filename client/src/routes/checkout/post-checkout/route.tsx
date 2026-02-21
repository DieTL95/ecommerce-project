import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/post-checkout")({
  component: RouteComponent,
});
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_PUBLIC);

function RouteComponent() {
  return (
    <Elements stripe={stripePromise}>
      <Outlet />
    </Elements>
  );
}
