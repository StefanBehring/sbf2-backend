"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLast10YearsDividendsRate = exports.getCurrentDividendsRate = void 0;
const serverError_1 = __importDefault(require("../lib/serverError"));
const Aktien = require('../models/Aktien');
const Dividenden = require('../models/Dividenden');
const Historisch = require('../models/Historisch');
function compare(a, b) {
    if (a.rate < b.rate) {
        return 1;
    }
    if (a.rate > b.rate) {
        return -1;
    }
    // a muss gleich b sein
    return 0;
}
function compareDividende(a, b) {
    if (a.dividende < b.dividende) {
        return 1;
    }
    if (a.dividende > b.dividende) {
        return -1;
    }
    // a muss gleich b sein
    return 0;
}
const getCurrentDividendsRate = async (req, res, next) => {
    try {
        const aktien = await Aktien.find();
        if (!aktien) {
            console.error('Aktien do not exist');
            return next({ status: 404, message: 'Aktien do not exist' });
        }
        const listData = [];
        for (const aktie of aktien) {
            const newEntry = {
                unternehmen: aktie.unternehmen,
                isin: aktie.isin,
                wert: 0,
                dividende: 0,
                rate: 0,
            };
            let ausgangsdatum = new Date();
            ausgangsdatum.setDate(ausgangsdatum.getDate() - 1);
            let checkDay = ausgangsdatum.getDate();
            let checkMonth = ausgangsdatum.getMonth() + 1;
            let checkYear = ausgangsdatum.getFullYear();
            if (checkDay < 10) {
                checkDay = `0${checkDay}`;
            }
            if (checkMonth === 12) {
                checkMonth = '01';
                checkYear += 1;
            }
            else if (checkMonth < 10) {
                checkMonth = `0${checkMonth}`;
            }
            const checkDate = `${checkDay}.${checkMonth}.${checkYear}`;
            const historisch = await Historisch.findOne({
                aktieId: aktie.id,
                datum: checkDate,
            });
            if (historisch) {
                newEntry.wert = historisch.ende;
            }
            else {
                console.warn('missing historisch for ' + aktie.unternehmen);
            }
            const dividenden = await Dividenden.find({ aktieId: aktie.id })
                .sort({
                jahr: -1,
            })
                .limit(1);
            if (dividenden.length > 0) {
                newEntry.dividende = dividenden[0].wert;
                newEntry.rate = newEntry.dividende / newEntry.wert;
                if (newEntry.wert > 0) {
                    listData.push(newEntry);
                }
            }
            else {
                console.warn('Missing dividends for ' + aktie.unternehmen);
            }
        }
        listData.sort(compare);
        res.status(200).json({
            listData,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getCurrentDividendsRate = getCurrentDividendsRate;
const getLast10YearsDividendsRate = async (req, res, next) => {
    console.log('(getLast10YearsDividendsRate) running');
    try {
        const aktien = await Aktien.find();
        if (!aktien) {
            console.error('Aktien do not exist');
            return next({ status: 404, message: 'Aktien do not exist' });
        }
        const listData = [];
        for (const aktie of aktien) {
            console.log('Tracking: ' + aktie.unternehmen);
            const newEntry = {
                unternehmen: aktie.unternehmen,
                isin: aktie.isin,
                wert: 0,
                dividende: 0,
                rate: 0,
            };
            let ausgangsdatum = new Date();
            ausgangsdatum.setDate(ausgangsdatum.getDate() - 1);
            let checkDay = ausgangsdatum.getDate();
            let checkMonth = ausgangsdatum.getMonth() + 1;
            let checkYear = ausgangsdatum.getFullYear();
            if (checkDay < 10) {
                checkDay = `0${checkDay}`;
            }
            if (checkMonth === 12) {
                checkMonth = '01';
                checkYear += 1;
            }
            else if (checkMonth < 10) {
                checkMonth = `0${checkMonth}`;
            }
            const checkDate = `${checkDay}.${checkMonth}.${checkYear}`;
            /*const historisch = await Historisch.findOne({
              aktieId: aktie.id,
              datum: checkDate,
            })
            if (historisch) {
              newEntry.wert = historisch.ende
            } else {
              console.warn('missing historisch for ' + aktie.unternehmen)
            }
            */
            const dividenden = await Dividenden.find({ aktieId: aktie.id })
                .sort({
                jahr: -1,
            })
                .limit(10);
            if (dividenden.length > 0) {
                for (const divi of dividenden) {
                    if (divi.wert) {
                        newEntry.dividende += divi.wert;
                    }
                }
                newEntry.rate = newEntry.dividende / newEntry.wert;
                if (newEntry.wert > 0) {
                    listData.push(newEntry);
                }
                else {
                    listData.push(newEntry);
                }
            }
            else {
                console.warn('Missing dividends for ' + aktie.unternehmen);
            }
        }
        listData.sort(compareDividende);
        res.status(200).json({
            listData,
        });
    }
    catch (error) {
        (0, serverError_1.default)(error, next);
    }
};
exports.getLast10YearsDividendsRate = getLast10YearsDividendsRate;
