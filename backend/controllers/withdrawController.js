const { getTimestamp } = require("../helpers/time/time");
const { accountModel } = require("../models/accountModel");
const { transactionModel } = require("../models/transactionModel");
const { withdrawalModel } = require("../models/withdrawalModel");


exports.withdrawFromAccount = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ message: "UserId and amount are required" });
        }

        const account = await accountModel.findOne({ userId: userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        //if insufficient balance
        if (account.balance < amount) {
            await transactionModel.create({
                accountId: account._id,
                amount,
                type: "withdrawal",
                status: "failed",
                timeStamp: getTimestamp(),
            });

            await withdrawalModel.create({
                transactionId: failedTransaction._id,
                accountId: account._id,
                amount,
                status: "failed",
                timeStamp: getTimestamp()
            });

            await auditLogModel.create({
                action: "withdrawal_failed",
                actorId:userId,
                amount,
                timeStamp: getTimestamp()
            });
            return res.status(400).json({ message: "Insufficient funds in account" });
        }
        const transaction = await transactionModel.create({
            account: account._id,
            amount,
            type: "withdrawal",
            timeStamp: getTimestamp()
        })

        //create a withdrawal entry
        await withdrawalModel.create({
            transactionId: transaction._id,
            accountId: account._id,
            amount,
            status: "allocated",
            timeStamp: getTimestamp()
        })

        account.balance -= amount;
        await account.save();

        return res.status(201).json({
            message: "Withdrawal successfullly",
        })


    } catch (error) {
        console.error("WITHDRAW ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}