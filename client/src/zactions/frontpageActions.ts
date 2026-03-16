import { frontpageSchema } from "@/schemas/frontpageSchema";
import type { Frontpage } from "@/utils/types";
import { z } from "zod";
export const fetchAllFrontpages = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/frontpage`,
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
    const data: Frontpage[] = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const fetchCurrentFrontpage = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/frontpage/current`,
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
    const data: Frontpage = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const fetchOneFrontpage = async (id: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/frontpage/${id}`,
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
    const data: Frontpage = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const addFrontpage = async (data: z.infer<typeof frontpageSchema>) => {
  console.log(" Action: ", data);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/frontpage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },

        body: JSON.stringify(data),
      },
    );
    console.log(res);
    if (res.ok) {
      const data: Frontpage = await res.json();
      console.log(data);
      return { error: false, message: "Frontpage created.", data };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating Frontpage failed.");
  }
};

export const updateFrontpageAction = async (id: string, data: Frontpage) => {
  try {
    // const parsedData = frontpageSchema.parse(data);
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/frontpage/${id}`,
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
      const data: Frontpage = await res.json();
      return { error: false, message: "Frontpage updated.", body: data.id };
    }
  } catch (error) {
    console.log("error: ", error);
    return { error: true, message: `Image update failed. Error: ${error}` };
  }
};

export const deleteFrontpageAction = async (id: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/frontpage/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
    if (res.ok) {
      const data: { message: string } = await res.json();
      return { error: false, message: data.message };
    }
  } catch (error) {
    console.log("error: ", error);
    return { error: true, message: `Image update failed. Error: ${error}` };
  }
};
