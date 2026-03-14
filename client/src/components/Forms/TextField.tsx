import { useFieldContext } from "@/context/form-context";
import { cn } from "@sglara/cn";
type Props = {
  label: string;
  props?: React.ComponentProps<"input">;
};

const TextField = ({ label, props }: Props) => {
  const field = useFieldContext<string>();
  return (
    <div className="relative min-w-[400px] flex flex-col">
      <input
        value={field.state.value}
        name={field.name}
        type="text"
        id={field.name}
        placeholder=" "
        className={cn(
          "peer border border-black px-4 py-3.5 w-full max-h-[48px]",
          field.state.meta.errors.length > 0 && "border-red-600",
        )}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      <label
        className=" absolute top-[7px] left-[14px] px-1 py-1 focus transition-all ease-initial duration-250"
        htmlFor={field.name}
      >
        {label}
      </label>
      {field.state.meta.errors.length > 0 && (
        <em role="alert" className="mt-2">
          {field.state.meta.errors.map((error, index) => (
            <em className="text-red-500" key={index}>
              {error?.message}
            </em>
          ))}
        </em>
      )}
    </div>
  );
};

export default TextField;
