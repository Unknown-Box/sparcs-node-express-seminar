const express = require('express');
const authMiddleware = require('../middleware/auth');
const AccountModel = require('../models/account');

const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    constructor() {
        AccountModel.insertMany([{ total: 10000 }], (err, docs) => {
            if (err) console.log(`[Bank-DB] Initializing Error: ${err}`);
            else console.log("[Bank-DB] DB Init Completed");
        })
    }

    getBalance = () => {
        return new Promise((resolve, reject) => {
            AccountModel.findOne({}, (err, account) => {
                if (err) reject({ success: false, data: err });
                else resolve({ success: true, data: account.total });
            })
        });
    }

    transaction = (amount) => {
        return new Promise((resolve, reject) => {
            AccountModel.updateOne({}, 
                                   { '$inc': { total: amount } }, 
                                   (err) => {
                                       if (err) reject(err);
                                       else this.getBalance()
                                                .then(resolve);
                                   });
        });
    }
}

const bankDBInst = BankDB.getInst();

router.post('/getInfo', authMiddleware, (req, res) => {
    try {
        const { success, data } = await bankDBInst.getBalance();
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, (req, res) => {
    try {
        const { amount } = req.body;
        const { success, data } = await bankDBInst.transaction( parseInt(amount) );
        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;