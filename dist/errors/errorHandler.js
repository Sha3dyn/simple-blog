"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(status, message) {
        super();
        this.status = status || 500;
        this.message = message || "Something unexpected happened";
    }
}
exports.CustomError = CustomError;
const errorHandler = (err, req, res, next) => {
    res.status(err.status).json({ error: err.message });
    next();
};
exports.default = errorHandler;
