const { Schema, model } = require("mongoose");

const auditLogSchema = new Schema({
    key: {
        type: String,
        unique: true
    },
    actorId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    action:{
        type:String
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: "transaction"
    },
    timeStamp: Number,
})

exports.auditLogModel = model('auditLog', auditLogSchema);