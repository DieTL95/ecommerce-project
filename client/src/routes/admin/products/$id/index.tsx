import { fetchOneProduct } from "@/utils/actions";
import { dollarsPrice } from "@/utils/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => await fetchOneProduct(params.id),

  head: ({ loaderData }) => ({
    meta: [
      { name: "description", content: loaderData?.description },
      { title: loaderData?.name },
    ],
  }),
});

function RouteComponent() {
  const prod = Route.useLoaderData();
  console.log(prod);
  if (!prod) {
    return <div>Such product doesn't exist</div>;
  }

  return (
    <div className="w-full flex flex-col ">
      <div className="w-full flex flex-row">
        <div className="flex-3/4 flex flex-row justify-center">
          {prod.images && prod.images.length > 0 && (
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                {prod.images?.map((img) => (
                  <img src={img.secure_url} className="max-w-[50px]" />
                ))}
              </div>

              <img
                src={prod.images?.[0].secure_url}
                className="max-w-[350px]"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1/4">
          <div>{prod.name}</div>
          <div>{dollarsPrice(prod.price)}</div>
          <div>{prod.description}</div>
        </div>
      </div>
      <div>
        <Link to="/admin/products/$id/edit" params={{ id: prod.id }}>
          Edit
        </Link>
      </div>
    </div>
  );
}
