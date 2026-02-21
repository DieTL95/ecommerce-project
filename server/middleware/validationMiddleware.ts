import type z from "zod";
import type { MiddlewareFunction } from "../utils/types.ts";
import { ZodError } from "zod";

type ValidateData = (
  schema: z.ZodObject<{
    body?: z.ZodTypeAny;
    files?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
  }>,
) => MiddlewareFunction;

export const validateData: ValidateData = (schema): MiddlewareFunction => {
  return async (req, res, next) => {
    console.log(req.body);
    const data = await schema.safeParseAsync({
      body: req.body,
      files: req.files,
      params: req.params,
      query: req.query,
    });

    if (!data.success) {
      console.log(data);
      if (data.error instanceof ZodError) {
        const errorMessages = data.error.issues.map((issue) => ({
          message: issue.message,
        }));
        return res.status(404).json(errorMessages);
      } else {
        console.log(data.error);
        return res.status(500).json("Server error");
      }
    }
    next();
  };
};
