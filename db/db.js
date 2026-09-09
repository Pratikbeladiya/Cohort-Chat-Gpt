const mongoose = require("mongoose");

async function ConnectDb(){

    try{
         await mongoose.connect(process.env.MONGO_URI)
         console.log("connect to database");
    }
    catch(error){
        console.log("error occured connect database",error);
    }
}

module.exports = ConnectDb;