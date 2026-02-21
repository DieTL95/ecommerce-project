import { productSchema } from "@/schemas/productSchema";
import type { Images, Products } from "@/utils/types";
import { z } from "zod";
export const fetchProducts = async (query?: string) => {
  try {
    const res = await fetch(
      `http://localhost:5100/api/products${query ? `?q=${query}` : ""}`,
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
    const data: Products[] = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const fetchOneProduct = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5100/api/products/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Products = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const addProduct = async (data: z.infer<typeof productSchema>) => {
  console.log("FormData Action: ", data);
  try {
    const res = await fetch("http://localhost:5100/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify(data),
    });
    console.log(res);
    if (res.ok) {
      const data: Products = await res.json();
      console.log(data);
      return { error: false, message: "Product created.", data };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating product failed.");
  }
};

export const updateProductAction = async (
  id: string,
  data: z.infer<typeof productSchema>,
) => {
  try {
    const res = await fetch(`http://localhost:5100/api/products/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    });
    console.log(res);
    if (res.ok) {
      const prod = await res.json();
      return { error: false, message: "Product updated.", body: prod.id };
    }
  } catch (error) {
    console.log("error: ", error);
    return { error: true, message: `Image update failed. Error: ${error}` };
  }
};

export const updateProdImagesAction = async (id: string, images: Images[]) => {
  console.log(images);
  try {
    const res = await fetch(`http://localhost:5100/api/products/${id}/images`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(images),
    });
    console.log(res);
    if (res.ok) {
      return { error: false, message: "Images updated." };
    }
  } catch (error) {
    console.log("error: ", error);
    return { error: true, message: `Image update failed. Error: ${error}` };
  }
};
