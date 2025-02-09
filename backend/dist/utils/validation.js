"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.paginationSchema = exports.validateRequest = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("./apiResponse");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Add validated data to request
            req.body = validatedData.body;
            req.query = validatedData.query;
            req.params = validatedData.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const details = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                next((0, apiResponse_1.validationError)(details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
// Common validation schemas
exports.paginationSchema = {
    page: zod_1.z.number().int().min(1).optional().default(1),
    limit: zod_1.z.number().int().min(1).max(100).optional().default(10),
    sort: zod_1.z.string().optional(),
    order: zod_1.z.enum(['asc', 'desc']).optional().default('asc'),
};
exports.idSchema = {
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID'),
};
// Configure custom error messages
zod_1.z.setErrorMap((issue, _ctx) => {
    let message;
    switch (issue.code) {
        case 'invalid_type':
            message = `Expected ${issue.expected}, received ${issue.received}`;
            break;
        case 'custom':
            message = issue.message || 'Invalid value';
            break;
        case 'invalid_string':
            if (issue.validation === 'regex')
                message = 'Invalid format';
            else if (issue.validation === 'email')
                message = 'Invalid email address';
            else
                message = `Invalid string - ${issue.validation}`;
            break;
        case 'too_small':
            message = `Must be greater than or equal to ${issue.minimum}`;
            break;
        case 'too_big':
            message = `Must be less than or equal to ${issue.maximum}`;
            break;
        case 'invalid_enum_value':
            message = `Invalid value. Expected one of: ${issue.options.join(', ')}`;
            break;
        default:
            message = issue.message || 'Invalid value';
    }
    return { message };
});
