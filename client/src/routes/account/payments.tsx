import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/payments")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { name: "description", content: "Manage your payments." },
      { title: "Payments" },
    ],
  }),
});

function RouteComponent() {
  return <div>Hello "/account/payments"!</div>;
}
