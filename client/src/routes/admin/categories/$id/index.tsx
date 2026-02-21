import Button from "@/components/UI/Button";
import {
  deleteCategoryAction,
  fetchOneCategory,
} from "@/zactions/catgeoriesActions";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/categories/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const data = await fetchOneCategory(params.id);
    if (!data) {
      throw notFound();
    }
    return data;
  },
  notFoundComponent: () => {
    return <div>doesn't eixst</div>;
  },
  head: ({ loaderData }) => ({
    meta: [
      { name: "title", content: "The categories." },
      { title: loaderData?.name },
    ],
  }),
});

function RouteComponent() {
  const catg = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const handleDelete = async () => {
    if (confirm("Do you want to delete this category?")) {
      const res = await deleteCategoryAction(catg.id);
      if (!res?.error) {
        toast(res?.message);
        navigate({ to: "/admin/categories" });
      }
    }
  };
  return (
    <div className="w-full flex flex-col ">
      <div className="w-full flex flex-row">
        <div className="flex-3/4 flex flex-row justify-center">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2">
              {catg.images?.map((img) => (
                <img src={img.secure_url} className="max-w-[50px]" />
              ))}
            </div>

            <img src={catg.images?.[0].secure_url} className="max-w-[350px]" />
          </div>
        </div>
        <div className="flex flex-col flex-1/4">
          <div>{catg.name}</div>
          <div>{catg.description}</div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Link to="/admin/categories/$id/edit" params={{ id: catg.id }}>
          Edit
        </Link>

        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}
