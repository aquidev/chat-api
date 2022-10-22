// const http = require('http');
// const https = require('https');
// const fs = require('fs');

const express = require('express');
const app = express();
const server = require('http').createServer(app);

var config = require('./config');
const cors = require('cors');

const messageDb =  require('./controller/messageDb');

// const conn = require('./services/db');



var host_url = config.apiHost.scheme + "://" + config.apiHost.host_url + ":" + config.apiHost.port;

// app.use(cors());
// app.use("/chat-app/testmysql", require("./routes/sample"));

app.set("view engine", "ejs");

app.get('/home', (req, res)=>{
    console.log("host ... " + config.apiHost.host_url);
    res.render('home', {host_url : host_url});
});

server.listen(config.apiHost.port, ()=>{
    console.log('⚡️ - Server Running... Listening on: ' + config.apiHost.port);
});

const socketIO = require('socket.io')(server, {cors: {origin:"*"}});

socketIO.on("connection", (socket) =>{

    console.log(`⚡️ - ${socket.id} has just connected`);
    
    socket.on('message', (data) =>{
        console.log(data);
        var params = {
            "name" : "aqui",
            "profile" : "emp"
        };
        messageDb.getMessagesById(params).then(result =>{
            console.log(results);
        });
        socket.broadcast.emit('message', data);
    });


});


// app.get("/chat-app/testmysql", async (req, res)=>{
//     try{
//         res.status(200).json(await messagesQuery.getSample());
//     }
//     catch(err){
//         console.error(`Error while getting messages`, err.message);
//     }
// });

