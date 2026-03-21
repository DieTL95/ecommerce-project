import ProductRowsSkeleton from "@/components/LoadingComps/ProductRowsSkeleton";
import ProductCard from "@/components/Products/ProductCard";
import ProductsRow from "@/components/Products/ProductsRow";
import MainWrapper from "@/components/UI/MainWrapper";
import Pagination from "@/components/UI/Pagination";
import { productSearchSchema } from "@/schemas/productSchema";
import { fetchOneCategoryProducts } from "@/zactions/catgeoriesActions";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$category/")({
  component: RouteComponent,

  validateSearch: productSearchSchema,

  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps, params }) => {
    const data = await fetchOneCategoryProducts({
      id: params.category,
      queries: deps,
    });
    if (!data) {
      throw notFound();
    }
    return data;
  },
  pendingComponent: () => <ProductRowsSkeleton numOfCards={8} />,
  notFoundComponent: () => <div>No such category exists.</div>,
  head: ({ loaderData }) => ({
    meta: [
      { name: "description", content: "All products of the category." },
      { title: `All ${loaderData?.name} Products` },
    ],
  }),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { page } = Route.useSearch();

  return (
    <MainWrapper>
      <ProductsRow>
        {data.results.map((prod) => (
          <Link
            key={prod.id}
            to="/products/$product"
            params={{ product: prod.id }}
          >
            <ProductCard key={prod.id} product={prod} />
          </Link>
        ))}
      </ProductsRow>
      <Pagination pages={data.pages} currentPage={page || 1} />
    </MainWrapper>
  );
}
