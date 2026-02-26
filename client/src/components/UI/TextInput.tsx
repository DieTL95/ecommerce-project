import { cn } from "@sglara/cn";

type Props = {
  label: string;
  classes?: string;
  props?: React.ComponentProps<"input">;
};
const TextInput = ({ label, classes, props }: Props) => {
  return (
    <div className="relative w-full flex flex-col ">
      <input
        name="text"
        type="text"
        placeholder=" "
        className={cn(
          "peer border px-4 py-3.5 w-full max-h-[48px] rounded-2xl border-neutral-600 hover:border-2 focus:border-2",
          classes && classes,
        )}
        {...props}
      />
      <label
        className=" absolute textinput top-[7px] left-[14px] px-1 py-1 focus transition-all ease-initial duration-250 pointer-events-none"
        htmlFor="text"
      >
        {label}
      </label>
    </div>
  );
};

export default TextInput;
