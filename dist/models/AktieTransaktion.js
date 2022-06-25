"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aktieTransaktionSchema = new mongoose_1.default.Schema({
    aktieId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Aktien',
        required: true,
    },
    anzahl: { type: Number, required: true },
    preis: { type: Number, required: true },
    datum: { type: String, required: true },
    istKauf: { type: Boolean, required: true },
});
const AktieTransaktion = mongoose_1.default.model('AktieTransaktion', aktieTransaktionSchema);
module.exports = AktieTransaktion;
