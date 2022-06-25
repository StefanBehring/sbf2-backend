"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAktieTransaktionenByAktieId = exports.getAktieTransaktionen = exports.createAktieTransaktion = void 0;
const serverError_1 = __importDefault(require("../lib/serverError"));
const Aktien = require('../models/Aktien');
const AktieTransaktion = require('../models/AktieTransaktion');
const createAktieTransaktion = async (req, res, next) => {
    const { aktieId, anzahl, preis, datum, istKauf } = req.body;
    if (aktieId === '' ||
        !Number.isInteger(anzahl) ||
        preis === null ||
        datum === '' ||
        !(istKauf === true || istKauf === false)) {
        const error = { message: 'Information missing.' };
        return next({ status: 400, message: error.message });
    }
    const aktie = await Aktien.findById(aktieId);
    if (!aktie) {
        console.error('Aktie does not exist');
        return next({ status: 404, message: 'Aktie does not exist' });
    }
    const newAktieTransaktion = {
        aktieId,
        anzahl,
        preis,
        datum,
        istKauf,
    };
    try {
        const aktieTransaktionResult = await AktieTransaktion.create(newAktieTransaktion);
        return res.status(201).json({
            aktieTransaktionResult,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.createAktieTransaktion = createAktieTransaktion;
const getAktieTransaktionen = async (req, res, next) => {
    try {
        const aktieTransaktionen = await AktieTransaktion.find();
        if (!aktieTransaktionen) {
            console.error('AktieTransaktion do not exist');
            return next({ status: 404, message: 'AktieTransaktion do not exist' });
        }
        res.status(200).json({
            data: aktieTransaktionen,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getAktieTransaktionen = getAktieTransaktionen;
const getAktieTransaktionenByAktieId = async (req, res, next) => {
    const { aktieId } = req.params;
    try {
        const aktieTransaktionen = await AktieTransaktion.find({ aktieId: aktieId });
        if (!aktieTransaktionen) {
            console.error('AktieTransaktion do not exist');
            return next({ status: 404, message: 'AktieTransaktion do not exist' });
        }
        res.status(200).json({
            data: aktieTransaktionen,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getAktieTransaktionenByAktieId = getAktieTransaktionenByAktieId;
