"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lists_1 = require("../controllers/lists");
const router = (0, express_1.Router)();
//router.post('/', createUser)
//router.get('/', getAktien)
router.get('/current-dividends-rate', lists_1.getCurrentDividendsRate);
router.get('/last-10-years-dividends-rate', lists_1.getLast10YearsDividendsRate);
// router.patch('/:userId', updateUser)
// router.delete('/:userId', deleteUser)
exports.default = router;
