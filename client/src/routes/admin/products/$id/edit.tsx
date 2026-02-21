import FileField from "@/components/Forms/FileField";
import FindAndInputField from "@/components/Forms/FindAndInputField";
import NumberField from "@/components/Forms/NumberField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import ImageInput from "@/components/ImageTools/ImageInput";
import ReorderImages from "@/components/ImageTools/ReorderImages";
import { fieldContext, formContext } from "@/context/form-context";
import { productSchema } from "@/schemas/productSchema";
import { fetchOneProduct } from "@/utils/actions";
import {
  updateProdImagesAction,
  updateProductAction,
} from "@/zactions/productActions";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: RouteComponent,
  loader: async ({ params }) => await fetchOneProduct(params.id),
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { FileField, TextField, NumberField, FindAndInputField },
  formComponents: {},
});

function RouteComponent() {
  const product: z.infer<typeof productSchema> = Route.useLoaderData();
  const { id: productId } = Route.useParams();
  const [list, setList] = useState(product.images || []);
  const form = useAppForm({
    defaultValues: { ...product, categories: product.categories },
    // validators: { onSubmit: productSchema },
    onSubmit: async ({ value }) => {
      console.log(value);
      value.images = list;
      const res = await updateProductAction(productId, value);
      if (res?.message) {
        toast(res.message);
      }
    },
  });
  console.log("List: ", list);

  const imagesHandler = async () => {
    const res = await updateProdImagesAction(productId, list);
    if (!res) {
      return toast.error("Server error.");
    }
    if (res.error) {
      return toast.error(res.message);
    }
    return toast.success(res.message);
  };
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
          children={(field) => <field.TextField label="Product Name" />}
        />
        <form.AppField
          name="description"
          children={(field) => <field.TextField label="Description" />}
        />
        <form.AppField
          name="price"
          children={(field) => <field.NumberField label="Price" />}
        />

        <form.AppField
          name="categories"
          defaultValue={product.categories}
          children={(field) => <field.FindAndInputField label="categories" />}
        />

        <SubmitButton label="Update Info" />

        <ReorderImages list={list} setList={setList} />
        <ImageInput
          label="Images"
          maxFiles={list ? 5 - list.length : 5}
          setList={setList}
        />
        <button
          type="button"
          onClick={imagesHandler}
          className="min-w-[400px] bg-black text-md text-white py-2 cursor-pointer flex justify-center items-center hover:bg-black/70"
        >
          Update Images
        </button>
      </form.AppForm>
    </form>
  );
}
