"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverError = (error, next) => {
    console.error(error);
    return next({ message: 'Server error!' });
};
exports.default = serverError;
