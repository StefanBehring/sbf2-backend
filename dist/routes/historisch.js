"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historisch_1 = require("../controllers/historisch");
const router = (0, express_1.Router)();
//router.post('/', createUser)
//router.get('/', getAktien)
router.get('/:aktieId', historisch_1.getHistorisch);
// router.patch('/:userId', updateUser)
// router.delete('/:userId', deleteUser)
exports.default = router;
