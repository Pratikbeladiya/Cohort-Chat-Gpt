const {Server} = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../model/auth.model");
const messageModel = require("../model/message.model");
const aiService = require("../services/ai.service");
const {createMemory,queryMemory}= require("../services/vector.service");

function initSocketServer(httpServer){
      const io=new Server(httpServer,{})

      //define the middleware of socket.io =>that verify the user identity before client send request to the server for socket.io connection

      io.use(async(socket,next)=>{
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

            if(!cookies.token){
                  return next(new Error ("Authentication error: No token provided"));
             }

                   try{
                    const decoded= jwt.verify(cookies.token,process.env.JWT_SECRET);
                    const user = await userModel.findById(decoded.id);
                    socket.user=user;
                    next()

                   }catch(err){
                    next(new Error("Authentication eror:Invalid token"));
                   }
           
      })

      io.on("connection",async (socket)=>{
      

            //what is inside the messagePayload:-{
            //chat:chatId,
            //content:message text content
            
            socket.on("ai-message", async (messagePayload) => {
                try{
             // Parse payload if sent as string from Postman
            const payload = typeof messagePayload === "string" ? JSON.parse(messagePayload) : messagePayload;
            console.log("Received payload: ",payload);
            
            //save user message
            await messageModel.create({
            chat: payload.chat,
            user: socket.user._id,
            content: payload.content,
            role: "user"
        });

      //here are long term memory created
        const vectors = await aiService.generateVector(payload.content);
        console.log("vectors generated", vectors);

      //here are short term memory created 
        const chatHistory = await messageModel.find({
            chat:payload.chat
        })
 
        //2.generate ai response
         const response = await aiService.generateResponse(chatHistory.map (item=>{
        return{
            role:item.role,
            parts:[{text:item.content}]
        }
        }));
        
         //3.save await model response
            await messageModel.create({
                chat: payload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            });
         
            //emit back to client 
            socket.emit("ai-response", {
                content: response,
                chat: payload.chat
            });
      
      }catch(err){
      console.log("Error handling ai-message: ",err);
       }
     
   }); // closes socket.on("ai-message")
    });     // closes io.on("connection")
}           // closes function initSocketServer
module.exports = initSocketServer;