import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req[source]);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    message: 'Validation error',
                    errors: err.errors,
                });
            } else {
                next(err);
            }
        }
    };
};
