import type { Orders } from "@/utils/types";

export const fetchOrders = async () => {
  try {
    const res = await fetch(`http://localhost:5100/api/orders/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Orders[] = await res.json();

    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};
export const fetchOrderById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5100/api/orders/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Orders = await res.json();

    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const updateOrderStatusAction = async (
  id: string,
  status: "paid" | "shipped" | "delivered",
) => {
  try {
    const res = await fetch(`http://localhost:5100/api/orders/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: Orders = await res.json();

    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};
