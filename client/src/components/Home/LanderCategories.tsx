import type { Categories } from "@/utils/types";
import CategoriesCard from "../Categories/CategoriesCard";
import { Link } from "@tanstack/react-router";

const LanderCategories = ({ categories }: { categories: Categories[] }) => {
  return (
    <div className=" w-full h-full flex justify-center items-center  ">
      <div className="grid  w-full h-full grid-cols-4 place-items-center c">
        {categories.map((catg) => (
          <Link to="/$category" params={{ category: catg.id }}>
            <CategoriesCard category={catg} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LanderCategories;
