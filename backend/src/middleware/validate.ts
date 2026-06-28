import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

interface ValidateSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Validate middleware factory.
 * Pass a schema object with optional body/query/params keys.
 * Replaces the target with parsed+coerced data so controllers always
 * receive clean, typed input.
 *
 * Usage:
 *   router.post('/register', validate({ body: registerSchema }), registerNewUser);
 *   router.get('/search', validate({ query: searchQuerySchema }), search);
 *   router.get('/:id', validate({ params: idParamSchema }), getById);
 */
export const validate = (schemas: ValidateSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: { field: string; message: string }[] = [];

    for (const target of ['body', 'query', 'params'] as const) {
      const schema = schemas[target];
      if (!schema) continue;

      const result = schema.safeParse(req[target]);

      if (!result.success) {
        result.error.issues.forEach((e) => {
          errors.push({
            field: e.path.length > 0 ? e.path.join('.') : target,
            message: e.message,
          });
        });
      } else {
        // Replace with Zod-parsed/coerced data (strips unknown keys, applies defaults)
        (req as any)[target] = result.data;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
};
