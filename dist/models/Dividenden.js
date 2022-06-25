"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dividendenSchema = new mongoose_1.default.Schema({
    aktieId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Aktien',
        required: true,
    },
    wert: { type: Number, required: true },
    waehrung: { type: String, required: true },
    jahr: { type: Number, required: true },
});
const Dividenden = mongoose_1.default.model('AktieDividenden', dividendenSchema);
module.exports = Dividenden;
