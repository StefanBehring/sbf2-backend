"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.createToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User = require('../models/User');
const serverError_1 = __importDefault(require("../lib/serverError"));
const { JWT_SECRET } = process.env;
const createToken = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            const error = {
                message: 'Incorrect data! Either username or password are wrong.',
            };
            return next({ status: 400, message: error.message });
        }
        bcryptjs_1.default.compare(password, user.password, (errCompare, resCompare) => {
            if (errCompare) {
                console.error(errCompare);
                return next({
                    status: 400,
                    message: 'Incorrect data! Either username or password are wrong.',
                });
            }
            if (resCompare) {
                const payload = {
                    user: {
                        id: user._id,
                    },
                };
                // TODO: expiration to 3600
                jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (errJWT, token) => {
                    if (errJWT) {
                        console.error(errJWT);
                        return next({ status: 400, message: errJWT.message });
                    }
                    res.status(200).json({ token, isUserAdmin: user.isAdmin });
                });
            }
            else {
                const error = {
                    message: 'Incorrect data! Either username or password are wrong.',
                };
                console.error(error.message);
                return next({ status: 400, message: error.message });
            }
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.createToken = createToken;
const checkToken = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const user = await User.findById(userId).select('-password');
        res.status(200).json(user);
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.checkToken = checkToken;
