import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { useState } from "react";
import toast from "react-hot-toast";
import FileListComponent from "../UI/FileList";
import type { Images } from "@/utils/types";
type Props = {
  label: string;
  maxFiles?: number;
  setList: Dispatch<SetStateAction<Images[]>>;
  setName: Dispatch<SetStateAction<string>>;
  props?: React.ComponentProps<"input">;
};

const ImageInput = ({ label, maxFiles, setList, setName, props }: Props) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: FileWithPath) => {
        if (JSON.stringify(myFiles).includes(file.path as string)) {
          return toast("File already exists.");
        } else if (myFiles.length > (maxFiles || 5)) {
          return toast("Maximum number of files exceeded.");
        } else {
          myFiles.push(file);
        }
      });

      setName(myFiles[0].name);
    },
    [maxFiles, myFiles, setName],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const removeFile = (file: FileWithPath) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  return (
    <>
      <div className="grid grid-cols-4">
        {myFiles.map((file: FileWithPath) => {
          return (
            <FileListComponent
              key={file.path}
              file={file}
              removeFile={removeFile}
              setList={setList}
            />
          );
        })}
      </div>

      <div
        {...getRootProps({
          className: "relative min-w-[400px] flex flex-col",
          id: "fileInputRoot",
        })}
      >
        <input
          {...getInputProps({
            name: "file",
            id: "file",

            ...props,
          })}
        />
        <label
          className=" absolute top-[7px] left-[14px] px-1 py-1 focus transition-all ease-initial duration-250"
          htmlFor="file"
        >
          {label}
        </label>

        <div className="w-full h-16 border-dashed  border-2 border-black/75 flex items-center justify-center text-gray-400">
          {isDragActive ? <p>Drop Images.</p> : <p>Drop Images Or Click.</p>}
        </div>
      </div>

      <div className="w-full"> </div>
    </>
  );
};

export default ImageInput;
