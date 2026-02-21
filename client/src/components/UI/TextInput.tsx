import { cn } from "@sglara/cn";

type Props = {
  label: string;
  props?: React.ComponentProps<"input">;
};
const TextInput = ({ label, props }: Props) => {
  return (
    <div className="relative w-full flex flex-col">
      <input
        name="text"
        type="text"
        placeholder=" "
        className={cn(
          "peer border border-black px-4 py-3.5 w-full max-h-[48px] ",
        )}
        {...props}
      />
      <label
        className=" absolute textinput top-[7px] left-[14px] px-1 py-1 focus transition-all ease-initial duration-250"
        htmlFor="text"
      >
        {label}
      </label>
    </div>
  );
};

export default TextInput;
