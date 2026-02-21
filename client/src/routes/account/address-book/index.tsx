import MainWrapper from "@/components/UI/MainWrapper";
import {
  deleteAddressAction,
  fetchAddresses,
  setDefaultAddress,
} from "@/zactions/addressActions";
import { cn } from "@sglara/cn";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/account/address-book/")({
  component: RouteComponent,
  loader: async () => {
    const data = await fetchAddresses();
    if (data) {
      return data;
    }
  },
});

function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const navigate = Route.useNavigate();
  const {
    auth: { user },
  } = Route.useRouteContext();
  const data = Route.useLoaderData();
  const handleDelete = async (id: string) => {
    setLoading(true);

    if (confirm("Do you want to delete this address?")) {
      const res = await deleteAddressAction(id);
      if (res) {
        toast.success(res.message);
        navigate({ to: "." });
      } else {
        toast.error("Deleting failed.");
      }
    }
    setLoading(false);
  };

  const handleSetDefault = async (id: string) => {
    setLoading(true);

    const res = await setDefaultAddress(id);
    if (res) {
      toast.success(res.message);
      navigate({ to: ".", reloadDocument: true });
    } else {
      toast.error("Error.");
    }

    setLoading(false);
  };
  return (
    <MainWrapper>
      <div>
        {!data || data.length === 0 ? (
          <div>
            <Link to="/account/address-book/new-address">
              Add a new address.
            </Link>
          </div>
        ) : (
          <div className="w-full grid grid-cols-3 gap-4">
            {data.map((address) => (
              <div
                key={address.id}
                className="flex flex-col gap-2 p-4 border border-gray-500/70 rounded-2xl"
              >
                <span className="font-bold text-xl">{address.label}</span>
                <div className="grid grid-cols-3">
                  <span>{address.address_one}</span>
                  <span>{address.address_two}</span>
                  <span>{address.city}</span>
                  <span>{address.province}</span>
                  <span>{address.zipcode}</span>
                  <span>{address.phonenumber}</span>
                </div>
                <div className=" flex flex-row gap-2">
                  <Link
                    to="/account/address-book/$id/edit"
                    params={{ id: address.id }}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    className={cn("cursor-pointer", loading && "cursor-wait")}
                    disabled={loading}
                  >
                    Delete
                  </button>
                  {user?.default_address_id !== address.id && (
                    <button
                      type="button"
                      className={cn("cursor-pointer", loading && "cursor-wait")}
                      onClick={() => handleSetDefault(address.id)}
                      disabled={loading}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <Link to="/account/address-book/new-address">
                Add a new address
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainWrapper>
  );
}
