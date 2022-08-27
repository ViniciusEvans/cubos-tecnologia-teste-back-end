import { NextFunction, Request, Response } from "express";
import { AnyObjectSchema } from "yup";

export const validateBody =
  (schema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

export const validateQuery =
  (schema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query);
      next();
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

export const validateParams =
  (schema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params);

      next();
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
