"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const auth_2 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post('/', auth_2.createToken);
router.get('/', auth_1.default, auth_2.checkToken);
exports.default = router;
