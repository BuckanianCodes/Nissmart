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
        default: "available"
    },
    timeStamp: Number,
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
});

accountSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

exports.accountModel = model('account', accountSchema);