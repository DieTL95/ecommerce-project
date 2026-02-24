import ProductCard from "@/components/Products/ProductCard";
import AddToCartButton from "@/components/UI/AddToCartButton";
import MainWrapper from "@/components/UI/MainWrapper";
import Pagination from "@/components/UI/Pagination";
import { productSearchSchema } from "@/schemas/productSchema";
import { fetchProducts } from "@/utils/actions";
import type { CountedResults, Products } from "@/utils/types";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
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
  const products: CountedResults<Products> = Route.useLoaderData();
  const { page } = Route.useSearch();

  return (
    <MainWrapper>
      <div className="w-full flex ">
        <div className="w-full flex flex-col  my-2 ">
          <div className="grid-cols-4 grid gap-2 h-full">
            {products.results.map((product) => (
              <div key={product.id} className="bg-black w-full h-full ">
                <div className="mx-auto w-fit">
                  <Link
                    to="/products/$product"
                    params={{ product: product.id }}
                  >
                    <ProductCard product={product} />
                  </Link>

                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
          <Pagination pages={products.pages} currentPage={page || 1} />
        </div>
      </div>
    </MainWrapper>
  );
}
