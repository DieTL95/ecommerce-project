import type { Images } from "@/utils/types";
import Reorder from "../Reorder";

const ReorderImages = ({
  list,
  setList,
}: {
  list: Images[];
  setList: React.Dispatch<React.SetStateAction<Images[]>>;
}) => {
  const removeImage = (id: string) => {
    const updatedList = list.filter((x) => x.public_id !== id);
    setList(updatedList);
  };

  return (
    <div className="flex flex-row  gap-4">
      {list.map((img, index) => (
        <div key={img.public_id} className="flex-col flex gap-2">
          <div className="max-w-2xs relative">
            <span
              className="-top-6 right-0 w-10 h-10 cursor-pointer rounded-[50%] hover:bg-black/60"
              onClick={() => removeImage(img.public_id)}
            >
              X
            </span>
            <img src={img.secure_url} />
          </div>
          <Reorder list={list} setList={setList} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ReorderImages;
