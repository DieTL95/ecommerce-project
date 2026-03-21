import Pagination from "@/components/UI/Pagination";
import { productSearchSchema } from "@/schemas/productSchema";
import { fetchCategories } from "@/zactions/catgeoriesActions";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/categories/")({
  component: RouteComponent,
  validateSearch: productSearchSchema,

  loaderDeps: ({ search }) => ({ q: search.q, page: search.page }),
  loader: async ({ deps }) => {
    const data = await fetchCategories(deps);
    if (!data) {
      throw notFound();
    }
    if (deps.page && deps.page > data.pages) {
      throw notFound();
    }
    return data;
  },
  notFoundComponent: () => {
    return <div>No categories found.</div>;
  },
  head: () => ({
    meta: [
      { name: "description", content: "The Categories." },
      { title: "Categories" },
    ],
  }),
});
function RouteComponent() {
  const data = Route.useLoaderData();
  const { page } = Route.useSearch();

  return (
    <div className="flex flex-col gap-2 w-full">
      {data.results.map((catg) => (
        <Link
          to="/admin/categories/$id"
          params={{ id: catg.id }}
          className="border border-gray-600/80 rounded-2xl w-full p-4"
          key={catg.id}
        >
          <div className="flex flex-row gap-4">
            {catg.images && catg.images.length > 0 && (
              <img
                src={catg.images[0].secure_url}
                alt={catg.name}
                className="max-h-52 max-w-[150px]"
              />
            )}
            <div>{catg.name}</div>
          </div>
        </Link>
      ))}
      <Pagination pages={data.pages} currentPage={page || 1} />
    </div>
  );
}
