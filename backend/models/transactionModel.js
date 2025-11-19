const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
    amount: {
        type: Number
    },
    userInitiated: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "account"
    },
    type: {
        type: String,
        enum: ['deposit', 'transfer', 'withdrawal'],
    },
    currency: {
        type: String,
        default: "KES"
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'allocated', "declined"],
        default: 'pending',
    },
    timeStamp: Number,
})

exports.transactionModel = model('transaction', transactionSchema);