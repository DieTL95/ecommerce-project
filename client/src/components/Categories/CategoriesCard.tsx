import type { Categories } from "@/utils/types";

const CategoriesCard = ({ category }: { category: Categories }) => {
  return (
    <div key={category.name} className="bg-black/60 w-full h-full ">
      <div className=" h-full overflow-hidden relative">
        <img
          src={category.images?.[0].secure_url}
          alt={category.name}
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
        <span className="absolute text-white bottom-0">{category.name}</span>
      </div>
    </div>
  );
};

export default CategoriesCard;
