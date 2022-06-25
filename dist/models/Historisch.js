"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historischSchema = new mongoose_1.default.Schema({
    aktieId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Aktien',
        required: true,
    },
    datum: { type: String, required: true },
    start: { type: Number, required: true },
    ende: { type: Number, required: true },
    hoch: { type: Number, required: true },
    tief: { type: Number, required: true },
    volumen: { type: Number, required: true },
});
const Historisch = mongoose_1.default.model('AktieHistorisch', historischSchema);
module.exports = Historisch;
