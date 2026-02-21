import ProductCard from "@/components/Products/ProductCard";
import ProductsRow from "@/components/Products/ProductsRow";
import MainWrapper from "@/components/UI/MainWrapper";
import { fetchOneCategory } from "@/zactions/catgeoriesActions";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$category/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const data = await fetchOneCategory(params.category);
    if (!data) {
      throw notFound();
    }
    return data;
  },
  notFoundComponent: () => <div>No such category exists.</div>,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <MainWrapper>
      <ProductsRow>
        {data.products.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </ProductsRow>
    </MainWrapper>
  );
}
