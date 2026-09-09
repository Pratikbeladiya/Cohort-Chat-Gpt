const app = require("./app");
require("dotenv").config();
const ConnectDb = require("./db/db");
ConnectDb();
const initSocketServer = require("./sockets/socket.server");
const httpServer = require("http").createServer(app);

initSocketServer(httpServer);

httpServer.listen(3000,()=>{
    console.log("app is running on port 3000");
})