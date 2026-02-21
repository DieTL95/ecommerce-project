import NumberField from "@/components/Forms/NumberField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import { fieldContext, formContext } from "@/context/form-context";
import { addressSchema } from "@/schemas/addressSchema";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { addAddressAction } from "@/zactions/addressActions";
import { z } from "zod";
import toast from "react-hot-toast";

export const Route = createFileRoute("/account/address-book/new-address")({
  component: RouteComponent,
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, NumberField },
  formComponents: {},
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { auth } = Route.useRouteContext();
  const form = useAppForm({
    defaultValues: {
      address_one: "",
      address_two: "",
      city: "",
      country: "",
      email: "",
      full_name: "",
      label: "",
      phonenumber: 0,
      province: "",
      zipcode: "",
    },
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof addressSchema> }) => {
      const res = await addAddressAction(value);
      if (res) {
        toast.success(res.message);
        console.log(res);
        if (!auth.isAuthenticated) {
          navigate({
            to: "/checkout",
            from: "/checkout",
            search: (prev) => ({ ...prev, addId: res.body.id }),
          });
        }
        navigate({
          to: "/account/address-book",
        });
      } else {
        toast.error("Couldn't add address.");
      }
    },
  });
  return (
    <div className="w-full flex flex-col">
      <div className="mx-auto">
        <h2 className="text-2xl">New Address</h2>
      </div>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppForm>
          <div className="w-full min-h-[700px] h-full items-center justify-center flex flex-col gap-4">
            <form.AppField
              name="label"
              children={(field) => (
                <field.TextField
                  label="Address Label"
                  props={{ placeholder: "" }}
                />
              )}
            />
            <form.AppField
              name="full_name"
              children={(field) => (
                <field.TextField
                  label="Full Name"
                  props={{ placeholder: "" }}
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField label="Email" props={{ placeholder: "" }} />
              )}
            />
            <form.AppField
              name="address_one"
              children={(field) => (
                <field.TextField
                  label="Address one"
                  props={{ placeholder: "" }}
                />
              )}
            />
            <form.AppField
              name="address_two"
              children={(field) => (
                <field.TextField
                  label="Address two"
                  props={{ placeholder: "" }}
                />
              )}
            />

            <form.AppField
              name="country"
              children={(field) => (
                <field.TextField label="Country" props={{ placeholder: "" }} />
              )}
            />
            <form.AppField
              name="province"
              children={(field) => (
                <field.TextField
                  label="Province/State"
                  props={{ placeholder: "" }}
                />
              )}
            />
            <form.AppField
              name="city"
              children={(field) => (
                <field.TextField label="City" props={{ placeholder: "" }} />
              )}
            />
            <form.AppField
              name="phonenumber"
              children={(field) => (
                <field.NumberField
                  label="Phone Number"
                  props={{ placeholder: "" }}
                />
              )}
            />
            <form.AppField
              name="zipcode"
              children={(field) => (
                <field.TextField label="Zipcode" props={{ placeholder: "" }} />
              )}
            />

            <SubmitButton />
          </div>
        </form.AppForm>
      </form>
    </div>
  );
}
