"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistorisch = void 0;
const compareDatumStringASC_1 = __importDefault(require("../lib/compareDatumStringASC"));
const serverError_1 = __importDefault(require("../lib/serverError"));
const Historisch = require('../models/Historisch');
const getHistorisch = async (req, res, next) => {
    const { aktieId } = req.params;
    try {
        const historisch = await Historisch.find({ aktieId });
        if (!historisch) {
            console.error('No historisch data found');
            return next({ status: 404, message: 'No historisch data found' });
        }
        historisch.sort((a, b) => (0, compareDatumStringASC_1.default)(a.datum, b.datum));
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            historisch,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getHistorisch = getHistorisch;
