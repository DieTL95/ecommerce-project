import { cn } from "@sglara/cn";

const Button = ({
  loading,
  label,
  className,
  children,
  onClick,
  props,
}: {
  loading?: boolean;
  label?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => Promise<void>;
  props?: React.ComponentProps<"button">;
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-xl bg-black text-md text-white py-2 cursor-pointer flex justify-center items-center hover:bg-white/20",
        className,
        loading && "cursor-wait",
      )}
      disabled={loading}
      onClick={onClick}
      {...props}
    >
      {label ? label : children}
    </button>
  );
};

export default Button;
