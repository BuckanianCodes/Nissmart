const { Schema, model } = require("mongoose");

const ledgerEntrySchema = new Schema({
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: "transaction"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "account"
    },
    amount: {
        type: Number
    },
    balanceAfter: {
        type: Number
    },
    entryType: {
        type: String,
        enum: ['credit', 'debit'],
    },
    description: {
        type: String
    },
    timeStamp: Number,
})

exports.ledgerEntryModel = model('ledgerEntry', ledgerEntrySchema);