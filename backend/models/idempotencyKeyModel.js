const { Schema, model } = require("mongoose");

const idempotencyKeySchema = new Schema({
    key: {
        type: String,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: "transaction"
    },
    timeStamp: Number,
})

exports.idempotencyKeyModel = model('idempotencyKey', idempotencyKeySchema);