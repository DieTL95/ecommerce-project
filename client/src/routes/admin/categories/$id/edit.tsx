import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import ImageInput from "@/components/ImageTools/ImageInput";
import ReorderImages from "@/components/ImageTools/ReorderImages";
import { fieldContext, formContext } from "@/context/form-context";
import {
  fetchOneCategory,
  updateCategoryAction,
  updateCatgImagesAction,
} from "@/zactions/catgeoriesActions";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/categories/$id/edit")({
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
      { name: "description", content: "The categories." },
      { title: loaderData?.name },
    ],
  }),
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, SubmitButton },
  formComponents: {},
});

function RouteComponent() {
  const category = Route.useLoaderData();
  const [list, setList] = useState(category.images || []);
  const form = useAppForm({
    // validators: {
    //   onChange: categorySchema,
    // },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await updateCategoryAction(category.id, value);
      if (!res?.error) {
        return toast("category created");
      }
    },
  });

  const imagesHandler = async () => {
    const res = await updateCatgImagesAction(category.id, list);
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
          defaultValue={category.name}
          children={(field) => <field.TextField label="Name" />}
        />
        <form.AppField
          name="description"
          defaultValue={category.description}
          children={(field) => <field.TextField label="description" />}
        />

        <SubmitButton label="Update Info" />

        <ReorderImages list={list} setList={setList} />
        <ImageInput
          label="Images"
          maxFiles={list ? 5 - list.length : 5}
          setList={setList}
          setName={() => {}}
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
