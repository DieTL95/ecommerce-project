import type { categorySchema } from "@/schemas/categorySchema";
import type {
  Categories,
  CountedResults,
  Images,
  Products,
} from "@/utils/types";
import { apiDomain } from "@/utils/utils";
import { z } from "zod";

export const fetchCategories = async (queries: {
  [key: string]: unknown | undefined;
}) => {
  const urlQuery = new URLSearchParams();
  for (const [key, val] of Object.entries(queries)) {
    if (val) {
      urlQuery.append(key, val.toString());
    }
  }
  try {
    const res = await fetch(`${apiDomain}/api/categories?${urlQuery}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(res);
    if (!res.ok) {
      throw new Error("Error");
    }
    const data: CountedResults<Categories> = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const fetchOneCategory = async (id: string) => {
  try {
    const res = await fetch(`${apiDomain}/api/categories/${id}`, {
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

export const fetchOneCategoryProducts = async ({
  id,
  queries,
}: {
  id: string;
  queries: { [key: string]: unknown | undefined };
}) => {
  try {
    const urlQuery = new URLSearchParams();
    for (const [key, val] of Object.entries(queries)) {
      if (val) {
        urlQuery.append(key, val.toString());
      }
    }
    const res = await fetch(
      `${apiDomain}/api/categories/${id}/products?${urlQuery}`,
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
    const data: CountedResults<Products> = await res.json();
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
    const res = await fetch(`${apiDomain}/api/categories`, {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCategoryAction = async (id: string, data: any) => {
  try {
    const res = await fetch(`${apiDomain}/api/categories/${id}`, {
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
    const res = await fetch(`${apiDomain}/api/categories/${id}/images`, {
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

export const deleteCategoryAction = async (id: string) => {
  try {
    const res = await fetch(`${apiDomain}/api/categories/${id}`, {
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
