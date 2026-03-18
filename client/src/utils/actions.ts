import { loginSchema, registerationSchema } from "@/schemas/userSchema";
import z from "zod";
import type { Cart, Products } from "./types";

export const isAuthAction = async () => {
  try {
    await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/auth/is-auth`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    return {
      message: "User is authenticated",
      error: false,
    };
  } catch (error) {
    return {
      message: "Not authenticated.",
      error: true,
      errorDetail: error,
    };
  }
};

export const registerUserAction = async (
  userData: z.infer<typeof registerationSchema>,
) => {
  try {
    const data = registerationSchema.parse(userData);

    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/auth/register`,
      {
        method: "POST",
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
      const data = await res.json();
      console.log(data);
      return data;
    } else {
      return await res.json();
    }
  } catch (error) {
    console.log("Error Data: ", error);
    return error;
  }
};

export const loginUserAction = async (
  userData: z.infer<typeof loginSchema>,
) => {
  try {
    const data = loginSchema.parse(userData);

    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    console.log(res);
    if (res.ok) {
      return "login succesful";
    }
  } catch (error) {
    console.log("Error Data: ", error);
    return error;
  }
};

export const fetchOneProduct = async (id: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/products/${id}`,
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
    const data: Products = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const addProduct = async (data: Products) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/products`, {
      method: "POST",

      body: JSON.stringify(data),
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return { error: false, message: "Product created." };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating product failed.");
  }
};

export const createCartAction = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/cart `, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data.body;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating cart failed.");
  }
};

export const handleCartAction = async () => {
  const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/cart`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data;
  }
};

export const fetchCartByIdAction = async (id: string) => {
  const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/cart/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  if (res.ok) {
    const data: Cart = await res.json();
    console.log(data);
    return data;
  }
};

export const addToCartAction = async (
  cart_id: string,
  quantity: number,
  product: Products,
) => {
  const { id: product_id, price } = product;
  try {
    const body = JSON.stringify({
      cart_id,
      product_id,
      price,
      quantity,
    });

    const res = await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/api/cart/${cart_id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      },
    );
    console.log("Add Res: ", res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return { error: false, message: "Item added to cart.", body: data };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating product failed.");
  }
};

export const updateCartAction = async ({
  cart_id,
  productId,
  quantity,
}: {
  cart_id: string;
  productId: string;
  quantity: number;
}) => {
  try {
    const body = JSON.stringify({
      cart_id: cart_id,
      product_id: productId,
      quantity,
    });

    const res = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/cart`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return { error: false, message: "Item added to cart.", body: data };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating product failed.");
  }
};

export const deleteCartItem = async (id: string) => {
  try {
    const res = await fetch(` /api/cart/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return { error: false, message: "Item deleted from cart." };
    }
  } catch (error) {
    console.log(error);
    throw new Error(" Removing product from cart failed.");
  }
};

export const clearCartAction = async () => {
  try {
    const res = await fetch(` /api/cart`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return { error: false, message: "Item deleted from cart." };
    }
  } catch (error) {
    console.log(error);
    throw new Error(" Removing product from cart failed.");
  }
};

export const createOrderAction = async ({
  value,
  user_id,
  order_items,
  address_id,
}: {
  value: number;
  user_id?: string | null;
  address_id?: string | undefined;
  order_items: {
    product_id: string;
    price: number;
    quantity: number;
  }[];
}) => {
  try {
    const body = JSON.stringify({
      value,
      user_id,
      address_id,
      order_items,
    });

    const res = await fetch(` /api/orders`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    console.log("Add Res: ", res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Creating order failed.", { cause: error });
  }
};
