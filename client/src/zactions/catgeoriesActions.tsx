import type { categorySchema } from "@/schemas/categorySchema";
import type { Categories, Images } from "@/utils/types";
import { z } from "zod";

export const fetchCategories = async (query?: string | undefined) => {
  try {
    const res = await fetch(
      `http://localhost:5100/api/categories/?q=${query ? query : ""}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Error");
    }
    const data: Categories[] = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const fetchOneCategory = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5100/api/categories/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Categories = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const createCategoryAction = async (
  data: z.infer<typeof categorySchema>,
) => {
  try {
    const res = await fetch(`http://localhost:5100/api/categories`, {
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
      return { error: false, message: "Category created." };
    }
  } catch (error) {
    console.log("error: ", error);
    return { error: true, message: `Image update failed. Error: ${error}` };
  }
};

export const updateCategoryAction = async (id: string, data) => {
  try {
    const res = await fetch(`http://localhost:5100/api/categories/${id}`, {
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
      return { error: false, message: "Category updated.", body: prod.id };
    }
  } catch (error) {
    console.log("error: ", error);
    return {
      error: true,
      message: `Updating Category Failed. Error: ${error}`,
    };
  }
};

export const updateCatgImagesAction = async (id: string, images: Images[]) => {
  try {
    const res = await fetch(
      `http://localhost:5100/api/categories/${id}/images`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(images),
      },
    );
    console.log(res);
    if (res.ok) {
      return { error: false, message: "Images updated." };
    }
  } catch (error) {
    console.log("error: ", error);
    return { error: true, message: `Image update failed. Error: ${error}` };
  }
};

export const deleteCategoryAction = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5100/api/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(res);
    if (res.ok) {
      const response = await res.json();
      return { error: false, message: response.message };
    }
  } catch (error) {
    console.log("error: ", error);
    return {
      error: true,
      message: `Deletint Category Failed. Error: ${error}`,
    };
  }
};
