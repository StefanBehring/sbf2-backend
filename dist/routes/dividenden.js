"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dividenden_1 = require("../controllers/dividenden");
const router = (0, express_1.Router)();
//router.post('/', createUser)
//router.get('/', getAktien)
router.get('/:aktieId', dividenden_1.getDividenden);
// router.patch('/:userId', updateUser)
// router.delete('/:userId', deleteUser)
exports.default = router;
