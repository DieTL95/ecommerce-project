import { useFieldContext } from "@/context/form-context";
import { cn } from "@sglara/cn";
type Props = {
  label: string;
  props?: React.ComponentProps<"input">;
};

const CheckboxField = ({ label, props }: Props) => {
  const field = useFieldContext<boolean | null>();
  return (
    <div className="relative min-w-[400px] flex flex-col">
      <div className="border border-black p-4 flex items-center gap-2  w-full max-h-[48px]">
        <input
          value={field.name}
          name={field.name}
          type="checkbox"
          id={field.name}
          defaultChecked={
            field.options.defaultValue ? field.options.defaultValue : undefined
          }
          placeholder=" "
          className={cn(
            "",

            field.state.meta.errors.length > 0 && "border-red-600",
          )}
          onChange={(e) => field.handleChange(e.target.checked)}
          {...props}
        />
        <label htmlFor={field.name} className="">
          {label}
        </label>
      </div>
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

export default CheckboxField;
