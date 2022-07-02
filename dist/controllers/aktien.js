"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAktieByIsin = exports.getAktieById = exports.getAktien = void 0;
const serverError_1 = __importDefault(require("../lib/serverError"));
const Aktien = require('../models/Aktien');
const getAktien = async (req, res, next) => {
    try {
        const aktien = await Aktien.find();
        if (!aktien) {
            console.error('Aktien do not exist');
            return next({ status: 404, message: 'Aktien do not exist' });
        }
        res.status(200).json({
            aktien,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getAktien = getAktien;
const getAktieById = async (req, res, next) => {
    const { aktieId } = req.params;
    try {
        const aktie = await Aktien.findById(aktieId);
        if (!aktie) {
            console.error('Aktie does not exist');
            return next({ status: 404, message: 'Aktie does not exist' });
        }
        res.status(200).json({
            id: aktie._id,
            unternehmen: aktie.unternehmen,
            isin: aktie.isin,
            url: aktie.url,
            urlBilanzGuv: aktie.urlBilanzGuv,
            urlDividende: aktie.urlDividende,
            urlHistorisch: aktie.urlHistorisch,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getAktieById = getAktieById;
const getAktieByIsin = async (req, res, next) => {
    const { isin } = req.params;
    console.log('GetAktieByIsin: ' + isin);
    try {
        const aktie = await Aktien.findOne({ isin: isin });
        if (!aktie) {
            console.error('Aktie does not exist');
            return next({ status: 404, message: 'Aktie does not exist' });
        }
        console.log(aktie);
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            id: aktie._id,
            unternehmen: aktie.unternehmen,
            isin: aktie.isin,
            url: aktie.url,
            urlBilanzGuv: aktie.urlBilanzGuv,
            urlDividende: aktie.urlDividende,
            urlHistorisch: aktie.urlHistorisch,
            lastUpdate: aktie.lastUpdate,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getAktieByIsin = getAktieByIsin;
