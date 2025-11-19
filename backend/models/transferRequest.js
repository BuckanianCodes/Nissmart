const { Schema, model } = require("mongoose");

const transferRequestSchema = new Schema({
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: "transaction"
    },
    userInitiated: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    amount: {
        type: Number
    },
    fromAccount: {
        type: Schema.Types.ObjectId,
        ref: "account"
    },
    toAccount: {
        type: Schema.Types.ObjectId,
        ref: "account"
    },
    status: {
        type: String,
        enum: ['approved', 'rejected']
    },
    timeStamp: Number,
})

exports.transferRequestModel = model('transferRequest', transferRequestSchema);