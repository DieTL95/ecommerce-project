import { fetchAllFrontpages } from "@/zactions/frontpageActions";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/frontpage/")({
  component: RouteComponent,
  loader: async () => {
    const data = await fetchAllFrontpages();
    if (!data) {
      throw notFound();
    }
    return data;
  },
  notFoundComponent: () => {
    return <div>No page found.</div>;
  },
  head: () => ({
    meta: [
      { name: "Frontpage", content: "The Frontpage." },
      { title: "Manage Frontpage" },
    ],
  }),
});
function RouteComponent() {
  const pages = Route.useLoaderData();
  return (
    <div>
      <h2>Manage Frontpage</h2>
      <div className="flex flex-col gap-4 w-full">
        {pages.map((page) => (
          <Link
            to="/admin/frontpage/$id"
            params={{ id: page.id }}
            className="p-4 border rounded-2xl border-gray-500/80 flex flex-col"
            key={page.id}
          >
            <div className="flex flex-row gap-4 w-full">
              <h1>{page.name}</h1>
              <div>{page.current ? "Current" : ""}</div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              {page.categories?.map((catg) => (
                <div key={catg.id}>
                  {catg.images && (
                    <img
                      style={{
                        height: "150px",
                        width: "150px",
                        objectFit: "contain",
                      }}
                      src={catg.images[0].secure_url}
                      alt={catg.name}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-2 w-full">
              {page.products?.map((product) => (
                <div key={product.id}>
                  {product.images && (
                    <img
                      style={{
                        height: "150px",
                        width: "150px",
                        objectFit: "fill",
                      }}
                      src={product.images[0].secure_url}
                      alt={product.name}
                    />
                  )}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
