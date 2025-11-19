const {Schema, model} = require("mongoose");

const transactionSchema = new Schema({

})

exports.transactionModel = model('transaction',transactionSchema);