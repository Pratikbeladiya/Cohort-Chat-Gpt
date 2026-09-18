const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
             type:String,
            required:true
        }
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const authModel = mongoose.model("Auth",authSchema);

module.exports = authModel;