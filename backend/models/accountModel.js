const { Schema, model } = require("mongoose");

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    balance: {
        type: Number
    },
    currency: {
        type: String,
        default: "KES"
    },
    accountStatus: {
        type: String,
        enum: ['disabled', 'available'],
    },
    timeStamp: Number,
})

exports.accountModel = model('account', accountSchema);