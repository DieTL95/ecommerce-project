import NumberField from "@/components/Forms/NumberField";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import TextField from "@/components/Forms/TextField";
import { fieldContext, formContext } from "@/context/form-context";
import { addressSchema } from "@/schemas/addressSchema";
import { editAddressAction, fetchOneAddress } from "@/zactions/addressActions";
import { createFormHook } from "@tanstack/react-form";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import toast from "react-hot-toast";

export const Route = createFileRoute("/account/address-book/$id/edit")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const res = await fetchOneAddress(params.id);
    if (!res) {
      throw notFound();
    }
    return res;
  },
  notFoundComponent: () => {
    return <div>Address doesn't exist</div>;
  },
  head: ({ params }) => ({
    meta: [
      { name: "description", content: "Manage or edit your address." },
      { title: `Edit Address #${params.id}` },
    ],
  }),
});

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, NumberField },
  formComponents: {},
});

function RouteComponent() {
  const address = Route.useLoaderData();

  const navigate = Route.useNavigate();
  const form = useAppForm({
    defaultValues: {
      label: address.label,
      address_one: address.address_one,
      address_two: address.address_two,
      email: address.email,
      city: address.city,
      province: address.province,
      country: address.country,
      phonenumber: address.phonenumber,
      full_name: address.full_name,
      zipcode: address.zipcode,
    },
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof addressSchema> }) => {
      const res = await editAddressAction(address.id, value);
      if (res) {
        toast.success(res.message);

        navigate({
          to: "/account/address-book",
        });
      } else {
        toast.error("Couldn't edit address.");
      }
    },
  });
  return (
    <div className="w-full flex">
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
