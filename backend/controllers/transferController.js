const { getTimestamp } = require("../helpers/time/time");
const { accountModel } = require("../models/accountModel");
const { auditLogModel } = require("../models/auditLogModel");
const { idempotencyKeyModel } = require("../models/idempotencyKeyModel");
const { ledgerEntryModel } = require("../models/ledgerEntryModel");
const { transactionModel } = require("../models/transactionModel");
const { userModel } = require("../models/UserModel");

exports.transferFunds = async (req, res) => {
    const {
     from_account, to_account, amount, idempotency_key
    } = req.body

    if (!from_account || !to_account || !amount || !idempotency_key) {
        return res.status(400).json({ message: "All fields are required" })
    }
    //Check 1:No transfer to same account
    if (from_account === to_account) {
        return res.status(400).json({message:"Cannot transfer funds to the same account"})
    }
    try {
    //Check 2:Checking idempotency
    const existingKey = await idempotencyKeyModel.findOne({key:idempotency_key});
    if(existingKey){
        return res.status(409).json({message:"Duplicate transfer request"})
    }

    const sender = await accountModel.findById(from_account);
    const recepient = await accountModel.findById(to_account);

    if(!sender || !recepient){
        res.status(404).json({message:"Sender or recepient account not found"});
    }

    //Check 3:Check sender balance last ledger

    const lastSenderLedger = await ledgerEntryModel
    .find({accountId:from_account})
    .sort({created_at:-1})
    .limit(1);

    const senderBalance = lastSenderLedger.length ? lastSenderLedger[0].balanceAfter : 0;

    if(amount > senderBalance){
        return res.status(400).json({message:"Insufficient funds in account"})
    }
    const timeStamp = getTimestamp();

    //Create transaction

    const transaction = new transactionModel({
        type:"transfer",
        fromAccount:from_account,
        toAccount:to_account,
        amount,
        timeStamp
    })

    await transaction.save();

    //debit ledger entry
    const debitLedger = new ledgerEntryModel({
        transactionId:transaction._id,
        accountId:from_account,
        entryType:"debit",
        amount,
        balanceAfter:senderBalance - amount,
        timeStamp
    });

    //get recepient last balance
    const lastRecepientLedger = await ledgerEntryModel
    .find({accountId:to_account})
    .sort({created_at:-1})
    .limit(1);

    const recepientBalance = lastRecepientLedger.length ? lastRecepientLedger[0].balanceAfter : 0;

    //credit entry ledger
    const creditLedger = new ledgerEntryModel({
        accountId:to_account,
        transactionId:transaction._id,
        entryType:"credit",
        amount,
        balanceAfter:recepientBalance + amount,
        timeStamp
    });

    await debitLedger.save();
    await creditLedger.save();

    sender.balance = senderBalance - amount;
    recepient.balance = recepientBalance + amount;

    await sender.save();
    await recepient.save();

    //save idempotency key
    const keyEntry = new idempotencyKeyModel({
        key:idempotency_key,
        userId:from_account,
        transactionId:transaction._id,
        timeStamp
    });

    await keyEntry.save();

    //Log in audit
    const auditLog = new auditLogModel({
        actorId:from_account,
        action:"TRANSFER_FUNDS",
        transactionId:transaction._id,
        timeStamp
    })

    await auditLog.save();

    return res.status(201).json({
        message:"Transfer successful",
        transaction,
        debitLedger,
        creditLedger
    })

        
    } catch (error) {
        console.log("Transfer error",error);
        return res.status(500).json({message:"internal server error"})
    }
}