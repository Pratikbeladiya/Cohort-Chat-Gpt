const {Server} = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../model/auth.model");
const messageModel = require("../model/message.model");
const aiService = require("../services/ai.service");

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

      io.on("connection",(socket)=>{
      //       console.log("User connected:",socket.user);
      //    console.log("New socket connection:", socket.id);

      /*
      socket.on("ai-message",async(messagePayload)=>{
            console.log(messagePayload);

            //what is inside the messagePayload:-{
            //chat:chatId,
            //content:message text content
            }
            

            await messageModel.create({
            chat:messagePayload.chat,
            user:socket.user._id,
            content:messagePayload.content,
            role:"user"
            })
            */
            try{
            socket.on("ai-message", async (messagePayload) => {
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
      })
      }catch(err){
      console.log("Error handling ai-message: ",err);
      }
      
         
      })
}

module.exports = initSocketServer;