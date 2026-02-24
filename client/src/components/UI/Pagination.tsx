import { cn } from "@sglara/cn";
import { Link } from "@tanstack/react-router";

const Pagination = ({
  pages,
  currentPage,
}: {
  pages: number;
  currentPage: number;
}) => {
  return (
    <div className="flex flex-row w-full items-center justify-center gap-2 mt-6 ">
      <Link
        to="."
        search={{ page: currentPage - 1 }}
        disabled={currentPage < 2 || !currentPage}
        className={cn(
          "p-4 rounded-xl bg-neutral-700 hover:bg-neutral-500 h-fit",
          (currentPage < 2 || !currentPage) && "invisible",
        )}
      >
        Prev
      </Link>
      <div className="flex flex-row items-center gap-2">
        {[...new Array(pages)].map((_, index) => {
          const page = index + 1;
          return (
            <Link
              key={index}
              to="."
              search={{ page }}
              disabled={currentPage === page || (!currentPage && page === 1)}
              className={cn(
                "px-2 py-2  text-lg rounded-md bg-neutral-700 hover:bg-neutral-500 h-fit",
                (currentPage === page || (!currentPage && page === 1)) &&
                  "font-bold hover:bg-neutral-700",
              )}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link
        to="."
        search={{ page: currentPage + 1 }}
        disabled={currentPage === pages}
        className={cn(
          "px-4 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-500 h-fit",
          currentPage === pages && "invisible",
        )}
      >
        Next
      </Link>
    </div>
  );
};

export default Pagination;
