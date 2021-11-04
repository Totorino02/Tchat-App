//includes
const express = require("express");
const http = require("http");
const path = require("path");
const socket_io = require("socket.io");
const formatMessage = require("./utils/message");
const {userJoinRoom, getCurrentUser, userLeaves, getRoomUsers} = require("./utils/users");

//global variables
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socket_io(server);
const botName = "Anon";

//listen on connect event
io.on("connect", socket=>{

    //listen on the user joining
    socket.on("joinRoom", ({room, username})=>{
        const user = userJoinRoom(socket.id, username, room);
        socket.join(user.room);
        console.log(user);
        const users = getRoomUsers(user.room);

        io.to(user.room).emit("room-info", ({room : user.room, users: users}));

        //emit an welcomed message to the connected user
        socket.emit("welcom-back", formatMessage(user.username,`Welcome in the tchat`));

        //emit an event to signal that someone join the tchat
        socket.broadcast.to(user.room).emit("joinAlert", formatMessage(user.username,`has joined the tchat`));

        //listen on the users messages
        socket.on("message", msg=>{
            socket.emit("senderMessage", formatMessage(user.username, msg));
            socket.broadcast.to(user.room).emit("broadcastMessage", formatMessage(user.username, msg));
        });
    })
    

    //run when clien disconnect
    socket.on("disconnect", ()=>{
        const user = userLeaves(socket.id);
        if(user){
            socket.broadcast.to(user.room).emit("welcom-back", formatMessage(user.username, " is disconnected"));
            const users = getRoomUsers(user.room);
            io.to(user.room).emit("room-info", ({room : user.room, users: users}));
        }
    });

})

//use local ressources
app.use(express.static(path.join(`${__dirname}/public`)));

//listen port of the server
server.listen(port, ()=>{
    console.log(`The server is started on ${port}`);
});