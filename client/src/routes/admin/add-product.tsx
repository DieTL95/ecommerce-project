import { addProduct } from "@/zactions/productActions";
import { createFileRoute } from "@tanstack/react-router";
import { createFormHook } from "@tanstack/react-form";
import { productSchema } from "@/schemas/productSchema";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import { fieldContext, formContext } from "@/context/form-context";
import TextField from "@/components/Forms/TextField";
import FileField from "@/components/Forms/FileField";
import toast from "react-hot-toast";
import NumberField from "@/components/Forms/NumberField";
import z from "zod";
import FindAndInputField from "@/components/Forms/FindAndInputField";
import ImageInput from "@/components/ImageTools/ImageInput";
import ReorderImages from "@/components/ImageTools/ReorderImages";
import { useEffect, useState } from "react";
import type { Images } from "@/utils/types";
export const Route = createFileRoute("/admin/add-product")({
  component: RouteComponent,
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { FileField, TextField, NumberField, FindAndInputField },
  formComponents: {},
});

const defaults: z.infer<typeof productSchema> = {
  name: "Skirt ",
  description:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  price: 3999,
  images: [],
  categories: [],
};

function RouteComponent() {
  const [list, setList] = useState<Images[]>([]);
  const [defaultName, setDefaultName] = useState<string>(" ");
  const navigate = Route.useNavigate();

  const form = useAppForm({
    defaultValues: defaults,
    // validators: {
    //   onChange: productSchema,
    // },

    onSubmit: async ({ value }) => {
      console.log(value);
      value.images = list;
      value.name = value.name.toLowerCase();
      const res = await addProduct(value);
      if (res?.message) {
        toast(res.message);
        navigate({
          to: "/admin/products/$id/edit",
          params: { id: res.data.id },
        });
      }
    },
  });
  useEffect(() => {
    form.reset({ ...defaults, name: defaultName }, { keepDefaultValues: true });
  }, [defaultName]);
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
          children={(field) => <field.FindAndInputField label="Categories" />}
        />

        <ReorderImages list={list} setList={setList} />
        <ImageInput
          label="Images"
          maxFiles={list ? 5 - list.length : 5}
          setList={setList}
          setName={setDefaultName}
        />

        <SubmitButton />
      </form.AppForm>
    </form>
  );
}
