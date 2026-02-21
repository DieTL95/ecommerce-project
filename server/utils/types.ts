import type { Request, Response, NextFunction } from "express";

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type MiddlewareParams = {
  req: Request;
  res: Response;
  next: NextFunction;
};

export interface FileWithPath extends File {
  readonly path?: string;
  readonly handle?: FileSystemFileHandle;
  readonly relativePath?: string;
  buffer: Buffer;
  mimetype: string;
}

export interface Images {
  public_id: string;

  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  url: string;
  secure_url: string;
}
