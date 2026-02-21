import { cn } from "@sglara/cn";

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
      className={cn("cursor-pointer", className, loading && "cursor-wait")}
      disabled={loading}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CartButton;
