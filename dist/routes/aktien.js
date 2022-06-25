"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aktien_1 = require("../controllers/aktien");
const router = (0, express_1.Router)();
//router.post('/', createUser)
router.get('/', aktien_1.getAktien);
router.get('/:aktieId', aktien_1.getAktieById);
router.get('/isin/:isin', aktien_1.getAktieByIsin);
// router.patch('/:userId', updateUser)
// router.delete('/:userId', deleteUser)
exports.default = router;
