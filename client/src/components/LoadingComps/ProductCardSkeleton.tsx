const ProductCardSkeleton = () => {
  return (
    <div className=" w-full h-full min-h-[150px]">
      <div className="flex flex-col  place-content-between items-center h-full w-full">
        <div className=" h-[345px] animate-pulse w-full max-w-[230px] ">
          <div className=" h-full rounded-xl bg-neutral-600 w-full"></div>
        </div>
        <div className="flex flex-col animate-pulse w-full max-w-[230px] h-16 justify-center items-center gap-2">
          <span className="bg-neutral-600 rounded-full w-full h-4"></span>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
