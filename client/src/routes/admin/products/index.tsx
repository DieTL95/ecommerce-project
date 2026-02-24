import { productSearchSchema } from "@/schemas/productSchema";
import { fetchProducts } from "@/utils/actions";
import { dollarsPrice } from "@/utils/utils";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ProductThumbnail from "@/components/UI/ProductThumbnail";
import Pagination from "@/components/UI/Pagination";
export const Route = createFileRoute("/admin/products/")({
  component: RouteComponent,
  validateSearch: productSearchSchema,

  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const data = await fetchProducts(deps.page);
    if (!data) {
      throw notFound();
    }
    if (deps.page && deps.page > data.pages) {
      throw notFound();
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
  const { page } = Route.useSearch();
  console.log(products);
  return (
    <div className="flex flex-col gap-2 w-full">
      {products.results.map((prod) => (
        <Link
          to="/admin/products/$id"
          params={{ id: prod.id }}
          className="border border-gray-600/80 rounded-2xl w-full p-4"
          key={prod.id}
        >
          <div className="flex flex-row gap-4">
            {prod.images && prod.images.length > 0 && (
              <ProductThumbnail imageId={prod.images[0].public_id} />
            )}
            <div>{prod.name}</div>
            <span>{dollarsPrice(prod.price)}</span>
          </div>
        </Link>
      ))}
      <Pagination pages={products.pages} currentPage={page || 1} />
    </div>
  );
}
