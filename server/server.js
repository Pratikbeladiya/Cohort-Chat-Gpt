require("dotenv").config();
const app = require("./app");

//call the connect Database function that actual connect server with database 
const ConnectDb = require("./db/db");
ConnectDb();

const initSocketServer = require("./sockets/socket.server");
const httpServer = require("http").createServer(app);

initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});