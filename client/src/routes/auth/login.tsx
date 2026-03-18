import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/context/form-context";
import TextField from "@/components/Forms/TextField";
import { loginSchema } from "@/schemas/userSchema";
import { loginUserAction } from "@/utils/actions";
import z from "zod";
import MainWrapper from "@/components/UI/MainWrapper";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import toast from "react-hot-toast";
export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
});

function RouteComponent() {
  const navigaet = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof loginSchema> }) => {
      const res = await loginUserAction(value);
      if (res) {
        toast.success(res as string);
        navigaet({ to: "/", replace: true });
      } else {
        toast.error("Login failed.");
      }
    },
  });
  return (
    <MainWrapper>
      <div className="w-full flex">
        <form
          className="flex w-full flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <div className="w-full min-h-[700px] h-[50vh] items-center justify-center flex flex-col gap-4">
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField label="Email" props={{ placeholder: "" }} />
                )}
              />
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField
                    label="Password"
                    props={{ placeholder: "" }}
                  />
                )}
              />

              <SubmitButton />
            </div>
          </form.AppForm>
        </form>
      </div>
    </MainWrapper>
  );
}
