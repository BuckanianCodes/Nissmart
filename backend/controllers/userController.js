const { getTimestamp } = require("../helpers/time/time");
const { auditLogModel } = require("../models/auditLogModel");
const { ledgerEntryModel } = require("../models/ledgerEntryModel");
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
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error:" + error.errorResponse.errmsg });
    }
}

exports.getUsers = async (req, res) => {
    try {
        // console.log("Called")
        const users = await userModel.find({});
        return res.status(200).json({message:"Available users",users})
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}