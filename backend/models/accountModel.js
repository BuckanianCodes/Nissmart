const {Schema, model} = require("mongoose");

const accountSchema = new Schema({

})

exports.accountModel = model('account',accountSchema);