"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDividenden = void 0;
const serverError_1 = __importDefault(require("../lib/serverError"));
const Dividenden = require('../models/Dividenden');
const getDividenden = async (req, res, next) => {
    const { aktieId } = req.params;
    try {
        const dividenden = await Dividenden.find({ aktieId });
        if (!dividenden) {
            console.error('No dividends found');
            return next({ status: 404, message: 'No dividends found' });
        }
        res.status(200).json({
            dividenden,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getDividenden = getDividenden;
