import ProductThumbnail from "@/components/UI/ProductThumbnail";
import { fetchOrderById } from "@/zactions/orderActions";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const data = await fetchOrderById(params.id);
    if (!data) {
      throw notFound();
    }
    return data;
  },
  notFoundComponent: () => {
    return <div>Order doesn't eixst</div>;
  },
  head: ({ params }) => ({
    meta: [
      {
        name: "description",
        content: "See an order's status and description.",
      },
      { title: `Order #${params.id}` },
    ],
  }),
});

function RouteComponent() {
  const order = Route.useLoaderData();
  return (
    <div>
      <div>Order Status: {order.status}</div>
      {order.order_items?.map((item) => (
        <div className="flex flex-row" key={item.id}>
          {item.product.images && (
            <div>
              <ProductThumbnail
                imageId={item.product.images[0].public_id}
                width={75}
              />
            </div>
          )}
          <div>
            <span>{item.product.name}</span>
          </div>
          <div>{item.price}</div>
          <div>{item.quantity}</div>
        </div>
      ))}
    </div>
  );
}
