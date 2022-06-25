"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const serverError_1 = __importDefault(require("../lib/serverError"));
const User = require('../models/User');
const createUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (username === '' || email === '' || password === '') {
        const error = { message: 'Information missing.' };
        return next({ status: 400, message: error.message });
    }
    try {
        let userTest = await User.findOne({ username });
        if (userTest) {
            const errorUser = { message: 'Username/E-Mail already exists' };
            return next({ status: 400, message: errorUser.message });
        }
        let emailTest = await User.findOne({ email });
        if (emailTest) {
            const errorEmail = { message: 'Username/E-Mail already exists' };
            return next({ status: 400, message: errorEmail.message });
        }
    }
    catch (err) {
        console.error(err);
        const error = { message: 'Unknown error!' };
        return next({ status: 400, message: error.message });
    }
    const newUser = {
        username,
        email,
        password,
    };
    const salt = await bcryptjs_1.default.genSalt(10);
    newUser.password = await bcryptjs_1.default.hash(password, salt);
    User.create(newUser)
        .then((user) => res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    }))
        .catch(next);
};
exports.createUser = createUser;
const getUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error('User does not exist');
            return next({ status: 404, message: 'User does not exist' });
        }
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const { password } = req.body;
    if (!password) {
        const error = { message: 'Information missing.' };
        return next({ status: 400, message: error.message });
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const newPassword = await bcryptjs_1.default.hash(password, salt);
    User.findByIdAndUpdate(userId, { password: newPassword }, { new: true })
        .then((user) => {
        if (!user) {
            throw new Error('Could not change the password');
        }
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    })
        .catch((error) => next({ status: 404, message: error.message || 'Document not found' }));
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            console.error('User does not exist');
            return next({ status: 404, message: 'User does not exist' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.deleteUser = deleteUser;
