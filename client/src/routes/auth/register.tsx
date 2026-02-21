import { createFileRoute } from "@tanstack/react-router";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/context/form-context";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import { registerationSchema } from "@/schemas/userSchema";
import { registerUserAction } from "@/utils/actions";
import z from "zod";
import MainWrapper from "@/components/UI/MainWrapper";
import toaster from "react-hot-toast";
export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
});

function RouteComponent() {
  const form = useAppForm({
    validators: {
      onChange: registerationSchema,
    },
    onSubmit: async ({
      value,
    }: {
      value: z.infer<typeof registerationSchema>;
    }) => {
      const res = await registerUserAction(value);
      toaster(res.message, {
        position: "bottom-right",
      });
    },
  });
  return (
    <MainWrapper>
      <div className="w-full flex">
        <form
          className="flex w-full flex-col gap-5  "
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <div className="w-full items-center justify-center flex flex-col gap-2">
              <form.AppField
                name="name"
                children={(field) => <field.TextField label="Name" />}
              />

              <form.AppField
                name="email"
                children={(field) => <field.TextField label="Email" />}
              />
              <form.AppField
                name="password"
                children={(field) => <field.TextField label="Password" />}
              />

              <SubmitButton />
            </div>
          </form.AppForm>
        </form>
      </div>
    </MainWrapper>
  );
}
