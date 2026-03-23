import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchOrders } from "@/zactions/orderActions";
import ProductThumbnail from "@/components/UI/ProductThumbnail";
export const Route = createFileRoute("/account/orders/")({
  component: RouteComponent,
  loader: async () => {
    const data = await fetchOrders();
    if (data) {
      return data;
    }
  },
  head: () => ({
    meta: [
      { name: "description", content: "See your order history." },
      { title: "Orders" },
    ],
  }),
});

function RouteComponent() {
  const orders = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-4 w-full">
      {orders?.map((order) => (
        <div
          className="p-4 border rounded-2xl border-gray-500/80 flex flex-col"
          key={order.id}
        >
          <Link to={"/account/orders/$id"} params={{ id: order.id }}>
            <div>
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex flex-row gap-4">
                    <time dateTime={order.created_at.toLocaleString()}>
                      {order.created_at.toLocaleString()}
                    </time>{" "}
                    <span>{order.status}</span>
                  </div>
                  <div className="flex flex-row gap-2">
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
                  </div>{" "}
                </div>
              ))}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
