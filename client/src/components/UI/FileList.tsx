import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { FileWithPath } from "react-dropzone";
import UploadIcon from "../Icons/UploadIcon";
import { fetchSignature } from "@/zactions/imageUploadActions";
import RadialProgress from "../Icons/RadialProgress";
import type { Images } from "@/utils/types";

type FileType = {
  file: string | ArrayBuffer | null;
  progress: number;
  status: "uploading" | "pending" | "uploaded" | "failed";
};

const defaultFile: FileType = {
  file: null,
  progress: 0,
  status: "pending",
};

const FileListComponent = ({
  file,
  setList,
  removeFile,
}: {
  file: FileWithPath;
  setList: Dispatch<SetStateAction<Images[]>>;

  removeFile: (file: FileWithPath) => () => void;
}) => {
  const [filePreview, setFilePreview] = useState(defaultFile);
  useEffect(() => {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      setFilePreview({
        ...filePreview,
        file: filereader.result,
      });
    };
  }, []);

  const handleUpload = async () => {
    setFilePreview((prev) => ({ ...prev, status: "uploading" }));
    const sigRes = await fetchSignature();
    if (!sigRes) {
      return;
    }
    const { cloudname, signature, timestamp, apikey } = sigRes;

    const url = "https://api.cloudinary.com/v1_1/" + cloudname + "/auto/upload";

    const payload = new FormData();

    payload.append("file", file);
    payload.append("api_key", apikey);
    payload.append("timestamp", timestamp);
    payload.append("signature", signature);

    const req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("progress", (e) => {
      const percentage = (e.loaded / e.total) * 100;
      console.log(percentage);
      setFilePreview((prev) => ({
        ...prev,
        progress: percentage,
        status: "uploading",
      }));
    });
    req.addEventListener("loadend", () => {
      setFilePreview((prev) => ({
        ...prev,
        progress: req.status === 200 ? 100 : 0,
        status: req.status === 200 ? "uploaded" : "failed",
      }));

      if (req.status === 200) {
        const response = JSON.parse(req.response);
        setList((prev) => [
          ...prev,
          {
            public_id: response.public_id,
            width: response.width,
            height: response.height,
            format: response.format,
            created_at: response.created_at,
            bytes: response.bytes,
            url: response.url,
            secure_url: response.secure_url,
          },
        ]);
      }
    });

    req.send(payload);
  };

  return (
    <div
      key={file.path}
      className="max-h-fit max-w-fit relative flex items-center justify-center"
    >
      <img
        src={filePreview?.file as string}
        alt="Image"
        className="max-h-[100px] max-w-[100] object-cover relative"
      />
      <button
        type="button"
        className="absolute z-20 w-full h-full flex items-center justify-center cursor-pointer bg-black/40"
        disabled={filePreview.status !== "pending"}
        onClick={handleUpload}
      >
        {filePreview.status === "pending" && <UploadIcon />}
        {filePreview.status !== "pending" && (
          <RadialProgress
            precentage={Math.round(filePreview.progress)}
            status={filePreview.status}
          />
        )}
      </button>
      {filePreview.status === "pending" && (
        <button
          type="button"
          className="absolute -top-5 -right-5 font-bold rounded-[50%] p-2 bg-black/25 cursor-pointer hover:bg-black/10"
          onClick={removeFile(file)}
        >
          X
        </button>
      )}
    </div>
  );
};

export default FileListComponent;
