import { cn } from "@sglara/cn";

const RadialProgress = ({
  precentage,
  status,
}: {
  precentage: number;
  status: string;
}) => {
  return (
    <div className="flex ">
      <div className="relative size-14">
        <svg
          className="size-full -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-neutral-500"
            strokeWidth="3"
          ></circle>

          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={cn(
              "stroke-current text-black",
              status === "uploaded"
                ? "text-green-600 dark:text-green-500"
                : status === "failed" && "text-red-600 dark:text-red-500",
            )}
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - precentage}
            strokeLinecap="round"
          ></circle>
        </svg>

        <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <span
            className={cn(
              "text-center text-2xl font-bold text-white",
              status === "uploaded"
                ? "text-green-600 dark:text-green-500"
                : status === "failed" && "text-red-600 dark:text-red-500",
            )}
          >
            {status === "uploading"
              ? `${Math.round(precentage)}`
              : status === "uploaded"
                ? "✔"
                : "!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadialProgress;
