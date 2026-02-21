import { SubmitButton } from "@/components/Forms/SubmitButton";
import { fieldContext, formContext } from "@/context/form-context";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import TextField from "@/components/Forms/TextField";
import { createCategoryAction } from "@/zactions/catgeoriesActions";
import { categorySchema } from "@/schemas/categorySchema";
import { z } from "zod";
import toast from "react-hot-toast";

const defaultValues: z.infer<typeof categorySchema> = {
  name: "",
  description: "",
};

export const Route = createFileRoute("/admin/add-category")({
  component: RouteComponent,
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, SubmitButton },
  formComponents: {},
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onChange: categorySchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await createCategoryAction(value);
      if (!res?.error) {
        return toast("category created");
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
          name="description"
          children={(field) => <field.TextField label="description" />}
        />

        <SubmitButton />
      </form.AppForm>
    </form>
  );
}
