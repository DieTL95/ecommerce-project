import type { Orders } from "@/utils/types";
import { apiDomain } from "@/utils/utils";

export const fetchOrders = async () => {
  try {
    const res = await fetch(`${apiDomain}/api/orders/`, {
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
    const res = await fetch(`${apiDomain}/api/orders/${id}`, {
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
    const res = await fetch(`${apiDomain}/api/orders/${id}`, {
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

export const fetchPaymentIntentAction = async (val: number) => {
  try {
    const res = await fetch(`${apiDomain}/api/checkout/payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: val }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log("error: ", error);
  }
};
