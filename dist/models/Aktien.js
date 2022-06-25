"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aktienSchema = new mongoose_1.default.Schema({
    unternehmen: { type: String, required: true },
    wkn: { type: String, required: false },
    isin: { type: String, required: false },
    url: { type: String, required: true },
    urlHistorisch: { type: String, required: false },
    urlBilanzGuv: { type: String, required: false },
    urlDividende: { type: String, required: false },
});
const Aktien = mongoose_1.default.model('Aktien', aktienSchema);
module.exports = Aktien;
