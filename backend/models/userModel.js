const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    fullName: {
        type: String,
        required:  true,
    },
    email: {
        type: String,
        required:  true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true
    }
})  

exports.userModel = model('user',userSchema);