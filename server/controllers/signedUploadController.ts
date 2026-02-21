import type { Request, Response } from "express";
import { v2 } from "cloudinary";
import { signatureForm } from "../utils/signedupload.ts";

export const signedUpload = async (req: Request, res: Response) => {
  const { signature, timestamp } = signatureForm();
  const cloudName = v2.config().cloud_name;
  const apiKey = v2.config().api_key;

  return res.status(200).json({
    signature: signature,
    timestamp: timestamp,
    cloudname: cloudName,
    apikey: apiKey,
  });
};
