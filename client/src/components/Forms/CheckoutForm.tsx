import { createOrderAction } from "@/utils/actions";
import { cn } from "@sglara/cn";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface Props {
  value: number | null;
  user_id: string | undefined;
  address_id: string | undefined;
  order_items: { product_id: string; price: number; quantity: number }[];
}

const CheckoutForm = ({ address_id, order_items, user_id, value }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const res = await createOrderAction({
      value: value!,
      user_id: user_id,
      address_id: address_id,
      order_items: order_items,
    });
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/checkout/post-checkout?order_id=${res?.body}`,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      throw new Error("error");
    }

    setIsLoading(false);
  };

  return (
    <div>
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        type="button"
        className={cn(
          "w-full my-2 py-2 bg-black text-white rounded-md cursor-pointer",
          isLoading && "cursor-wait",
        )}
        onClick={handleSubmit}
      >
        {isLoading ? "Loading..." : "Pay now"}
      </button>
    </div>
  );
};

export default CheckoutForm;
