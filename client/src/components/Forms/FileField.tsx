import { useFieldContext } from "@/context/form-context";
import {
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { useState } from "react";
import type { Updater } from "@tanstack/react-form";
import toast from "react-hot-toast";
import FileListComponent from "../UI/FileList";
import type { Images } from "@/utils/types";
type Props = {
  label: string;
  maxFiles?: number;

  setList: Dispatch<SetStateAction<Images[]>>;
  props?: React.ComponentProps<"input">;
};

const FileField = ({ label, maxFiles, setList, props }: Props) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const field = useFieldContext<File[]>();

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
    },
    [maxFiles, myFiles],
  );

  useEffect(() => {
    field.handleChange(myFiles as Updater<File[]>);
  }, [myFiles]);

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

        {field.state.meta.errors.length > 0 && (
          <em role="alert" className="mt-2">
            {field.state.meta.errors.map((error, index) => (
              <em className="text-red-500" key={index}>
                {error?.message}
              </em>
            ))}
          </em>
        )}
        <div className="w-full h-16 border-dashed  border-2 border-black/75 flex items-center justify-center text-gray-400">
          {isDragActive ? <p>Drop Images.</p> : <p>Drop Images Or Click.</p>}
        </div>
      </div>
    </>
  );
};

export default FileField;
