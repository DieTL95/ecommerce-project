import CategoriesSelectField from "@/components/Forms/CategoriesSelectField";
import CheckboxField from "@/components/Forms/CheckboxField";
import ProductSelectField from "@/components/Forms/ProductSelectField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import { fieldContext, formContext } from "@/context/form-context";
import { addFrontpage } from "@/zactions/frontpageActions";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
});
export const Route = createFileRoute("/admin/frontpage/new-frontpage")({
  component: RouteComponent,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { name: "description", content: "Create a new frontpage" },
      { title: "New Frontpage" },
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

const defaultValues = {
  name: "",
  current: false,
  categories: {
    name: "",
    description: "",
    images: [],
  },
  products: {
    name: "",
    description: "",
    images: [],
    categories: [],
    price: 9999,
  },
};

function RouteComponent() {
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await addFrontpage(value);
      if (res && !res.error) {
        toast(res.message);
      }
    },
  });

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
          children={(field) => <field.TextField label="Name" />}
        />

        <form.AppField
          name="categories"
          mode="array"
          children={(field) => (
            <field.CategoriesSelectField label="Categories" />
          )}
        />
        <form.AppField
          name="products"
          mode="array"
          children={(field) => <field.ProductSelectField label="Products" />}
        />
        <form.AppField
          name="current"
          children={(field) => <field.CheckboxField label="Set as current?" />}
        />

        <SubmitButton />
      </form.AppForm>
    </form>
  );
}
