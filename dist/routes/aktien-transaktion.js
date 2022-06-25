"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aktie_transaktion_1 = require("../controllers/aktie-transaktion");
const router = (0, express_1.Router)();
router.post('/', aktie_transaktion_1.createAktieTransaktion);
router.get('/', aktie_transaktion_1.getAktieTransaktionen);
router.get('/:aktieId', aktie_transaktion_1.getAktieTransaktionenByAktieId);
// router.patch('/:userId', updateUser)
// router.delete('/:userId', deleteUser)
exports.default = router;
