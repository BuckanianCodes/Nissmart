const { getTimestamp } = require("../helpers/time/time");
const { accountModel } = require("../models/accountModel");
const { auditLogModel } = require("../models/auditLogModel");
const { ledgerEntryModel } = require("../models/ledgerEntryModel");
const { transactionModel } = require("../models/transactionModel");
const { userModel } = require("../models/UserModel");


exports.createUser = async (req, res) => {
    try {


        const { email, fullName } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({ message: "Name and email are required" })
        }

        const user = new userModel({
            fullName,
            email
        })

        await user.save();

        const account = new accountModel({
            userId: user._id,
            balance: 0,
            timeStamp: getTimestamp()
        });

        await account.save();


        const ledgerEntry = new ledgerEntryModel({
            userId: user._id,
            transactionId: null,
            entryType: "credit",
            amount: 0,
            balanceAfter: 0,
            description: "User creation initialization ledger",
            timeStamp: getTimestamp()
        })

        await ledgerEntry.save();

        const auditLog = new auditLogModel({
            actorId: user._id,
            action: "CREATE_USER",
            timeStamp: getTimestamp()
        })

        await auditLog.save();

        return res.status(201).json({
            message: "User created successfully",
            user
        })


    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }
        // console.error("Error creating user:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.getUsers = async (req, res) => {
    try {
        // console.log("Called")
        const users = await userModel.find({});
        return res.status(200).json({ message: "Available users", users })
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.viewUserBalance = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await userModel.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //check user account exists
        const account = await accountModel.findOne({ userId: user_id });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        //Return balance
        return res.status(200).json({
            user: user.email,
            account: account
        })
    } catch (error) {
        console.error("BALANCE ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getUserTransactions = async (req, res) => {

    try {


        const { user_id } = req.params;

        // 1. Check if user exists
        const user = await userModel.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //get user's account
        const account = await accountModel.findOne({ userId: user_id });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        const accountId = account._id;

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: accountId },
                { toAccount: accountId },
                { accountId: accountId }
            ]
        })
            .sort({ timeStamp: -1 });

        return res.status(200).json({
            user: user.username || user.email,
            accountId,
            total: transactions.length,
            transactions
        });

    } catch (error) {
        console.error("TRANSACTION HISTORY ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}