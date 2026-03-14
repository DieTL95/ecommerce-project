import { useFormContext } from "@/context/form-context";
import { cn } from "@sglara/cn";
export const SubmitButton = ({ label }: { label?: string }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => {
        return [state.canSubmit, state.isSubmitting, state.isSubmitSuccessful];
      }}
      children={([canSubmit, isSubmitting, isSubmitSuccessful]) => (
        <button
          type="submit"
          disabled={!canSubmit || isSubmitSuccessful}
          className={cn(
            "min-w-[400px] rounded-xl bg-black text-md text-white py-2 cursor-pointer flex justify-center items-center hover:bg-black/70",
            (!canSubmit || isSubmitSuccessful) &&
              "cursor-not-allowed bg-black/70",
          )}
        >
          {isSubmitting ? "Submitting..." : label || "Submit"}
        </button>
      )}
    />
  );
};
