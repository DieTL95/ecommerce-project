import { fetchProducts } from "@/utils/actions";
import { dollarsPrice } from "@/utils/utils";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/")({
  component: RouteComponent,
  loader: async () => {
    const data = await fetchProducts();
    if (!data) {
      notFound();
    }
    return data;
  },
  notFoundComponent: () => {
    return <div>No products found.</div>;
  },
  head: () => ({
    meta: [
      { name: "Products", content: "The products." },
      { title: "Products" },
    ],
  }),
});

function RouteComponent() {
  const products = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-2 w-full">
      {products?.map((prod) => (
        <Link
          to="/admin/products/$id"
          params={{ id: prod.id }}
          className="border border-gray-600/80 rounded-2xl w-full p-4"
          key={prod.id}
        >
          <div className="flex flex-row gap-4">
            {prod.images && prod.images.length > 0 && (
              <img
                src={prod.images[0].secure_url}
                alt={prod.name}
                className="max-h-52 max-w-[150px]"
              />
            )}
            <div>{prod.name}</div>
            <span>{dollarsPrice(prod.price)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
