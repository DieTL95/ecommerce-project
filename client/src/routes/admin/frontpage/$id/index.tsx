import CategoriesSelectField from "@/components/Forms/CategoriesSelectField";
import CheckboxField from "@/components/Forms/CheckboxField";
import ProductSelectField from "@/components/Forms/ProductSelectField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import Button from "@/components/UI/Button";
import { fieldContext, formContext } from "@/context/form-context";
import type { Frontpage } from "@/utils/types";
import {
  deleteFrontpageAction,
  fetchOneFrontpage,
  updateFrontpageAction,
} from "@/zactions/frontpageActions";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute, notFound } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/frontpage/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const data = await fetchOneFrontpage(params.id);
    if (!data) {
      throw notFound();
    }
    return data;
  },
  pendingComponent: () => <div>Loading..........</div>,
  pendingMs: 0,
  pendingMinMs: 1000,
  notFoundComponent: () => {
    return <div>doesn't eixst</div>;
  },
  head: ({ loaderData }) => ({
    meta: [
      { name: "Frontpage", content: "The Frontpage." },
      { title: `Manage ${loaderData?.name} Page` },
    ],
  }),
});
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SubmitButton,
    CheckboxField,
    ProductSelectField,
    CategoriesSelectField,
  },
  formComponents: {},
});
function RouteComponent() {
  const page = Route.useLoaderData();
  const navigate = Route.useNavigate();
  if (!page.products) {
    throw notFound();
  }

  const deleteHandler = async () => {
    if (confirm("Are you sure you want to delete this frontpage?")) {
      const res = await deleteFrontpageAction(page.id);
      if (!res || res.error) {
        toast(`Deletion failed. Error: ${res?.message}`);
      } else {
        toast.success(res.message);
        navigate({ to: ".." });
      }
    }
  };

  const form = useAppForm({
    onSubmit: async ({ value }) => {
      const res = await updateFrontpageAction(page.id, value as Frontpage);
      if (res && !res?.error) {
        return toast(res?.message);
      }
    },
  });
  console.log(form.state);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex w-full flex-col gap-5"
    >
      <form.AppForm>
        <form.AppField
          name="name"
          defaultValue={page.name}
          children={(field) => <field.TextField label="Name" />}
        />

        <form.AppField
          name="categories"
          mode="array"
          defaultValue={page.categories}
          children={(field) => (
            <field.CategoriesSelectField label="Categories" />
          )}
        />
        <form.AppField
          name="products"
          mode="array"
          defaultValue={page.products}
          children={(field) => <field.ProductSelectField label="Products" />}
        />
        <form.AppField
          name="current"
          defaultValue={page.current}
          children={(field) => <field.CheckboxField label="Set as current?" />}
        />

        <SubmitButton />
        <div>
          <Button
            className="bg-red-800 hover:bg-red-800/80"
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </div>
      </form.AppForm>
    </form>
  );
}
