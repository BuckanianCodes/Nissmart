const { accountModel } = require("../models/accountModel");
const { auditLogModel } = require("../models/auditLogModel");
const { transactionModel } = require("../models/transactionModel");
const { userModel } = require("../models/UserModel");
const { withdrawalModel } = require("../models/withdrawalModel");


exports.systemSummary = async (req, res) => {
    try {
        const users = await userModel.find({});

        const withdrawals = await withdrawalModel.find({});

        const accounts = await accountModel.find({});

        const totalAmount = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

        const transactions = await transactionModel.find({});



        res.status(200).json({
            message: "System summary",
            totalUsers: users.length,
            totalAmount: totalAmount,
            totalWithdrawals: withdrawals.length,
            totalTransactions: transactions.length
        }

        )
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: "Server error:", error })
    }
}

exports.recentActivities = async (req, res) => {
    try {
        const audits = await auditLogModel.find({});
        return res.status(200).json({ message: "Logs:", audits })
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: "Server error:", error })
    }
}