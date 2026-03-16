import { addressSchema } from "@/schemas/addressSchema";
import type { Addresses } from "@/utils/types";
import { z } from "zod";

export const fetchAddresses = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/address`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Addresses[] = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const fetchOneAddress = async (id: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/address/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Addresses = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const addAddressAction = async (
  addressData: z.infer<typeof addressSchema>,
) => {
  try {
    const data = addressSchema.parse(addressData);
    console.log(data);

    const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/address`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    });
    console.log(res);
    if (res.ok) {
      const data: Addresses = await res.json();
      console.log(data);
      return { error: false, message: "Address created.", body: data };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Adding address failed.");
  }
};

export const editAddressAction = async (
  id: string,
  addressData: z.infer<typeof addressSchema>,
) => {
  try {
    const data = addressSchema.parse(addressData);
    console.log(data);

    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/address/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      },
    );
    console.log(res);
    if (res.ok) {
      const data: Addresses = await res.json();
      console.log(data);
      return { error: false, message: "Address created.", body: data };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Adding address failed.");
  }
};

export const deleteAddressAction = async (id: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL} /api/address/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
    console.log(res);
    if (res.ok) {
      return { error: false, message: "Address deleted." };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Deleting address failed.");
  }
};

export const setDefaultAddress = async (id: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/users`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ default_address_id: id }),
    });
    console.log(res);
    if (res.ok) {
      return { error: false, message: "Default address updated." };
    }
  } catch (error) {
    console.log(error);
    throw new Error("error.");
  }
};
