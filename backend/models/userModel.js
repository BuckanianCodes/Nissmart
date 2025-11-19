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
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true
    },
        phoneNumber: {
        type: String,
        required:  true,
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    }
})  

exports.userModel = model('user',userSchema);