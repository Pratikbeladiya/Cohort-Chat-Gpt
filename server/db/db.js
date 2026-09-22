const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

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