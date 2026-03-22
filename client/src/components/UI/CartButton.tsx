import { cn } from "@sglara/cn";
import Spinner from "../Icons/Spinner";

const CartButton = ({
  loading,
  label,
  className,
  onClick,
}: {
  loading: boolean;
  label: string;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-10 h-10 text-2xl m-1 rounded-2xl hover:bg-neutral-700 cursor-pointer",
        className,
        loading && "cursor-wait",
      )}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : label}
    </button>
  );
};

export default CartButton;
