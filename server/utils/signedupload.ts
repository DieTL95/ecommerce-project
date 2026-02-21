import { v2 } from "cloudinary";
import { UnauthorisedError } from "../errors/customErrors.ts";

export const signatureForm = () => {
  const apiSecret = v2.config().api_secret;
  if (!apiSecret) {
    throw new UnauthorisedError("");
  }
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    apiSecret,
  );

  return { timestamp, signature };
};
