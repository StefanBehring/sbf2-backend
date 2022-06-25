"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(error, request, response, next) {
    console.error(error);
    const statusCode = error.status || 500;
    response.status(statusCode).json(error);
}
exports.default = errorHandler;
