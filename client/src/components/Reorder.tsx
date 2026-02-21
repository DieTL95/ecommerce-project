import LeftArrow from "./Icons/LeftArrow";
import RightArrow from "./Icons/RightArrow";

type ReorderType<Type> = {
  list: Type[];
  setList: React.Dispatch<React.SetStateAction<Type[]>>;
  index: number;
};

const Reorder = <ItemType,>({
  list,
  setList,
  index,
}: ReorderType<ItemType>) => {
  const reorder = (
    origList: ItemType[],
    startIndex: number,
    endIndex: number,
  ): ItemType[] => {
    const result = origList;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  return (
    <div className="flex flex-row">
      {index > 0 && (
        <button
          type="button"
          className="cursor-pointer rounded-[50%] p-2 hover:bg-black/50 "
          onClick={() => setList([...reorder(list, index, index - 1)])}
        >
          <LeftArrow />
        </button>
      )}
      {index < list.length - 1 && (
        <button
          type="button"
          className="cursor-pointer rounded-[50%] p-2 hover:bg-black/50 "
          onClick={() => setList([...reorder(list, index, index + 1)])}
        >
          <RightArrow />
        </button>
      )}
    </div>
  );
};

export default Reorder;
