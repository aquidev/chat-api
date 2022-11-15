// const http = require('http');
// const https = require('https');
// const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);

var config = require('./config');
const cors = require('cors');


const messageDb =  require('./controller/messageDb');

// const conn = require('./services/db');


var host_url = config.apiHost.scheme + "://" + config.apiHost.host_url + ":" + config.apiHost.port;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'keys, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));


// app.use(cors());
app.use("/chat-app", require("./routes/sample"));
app.use("/truck", require("./routes/truck"));
app.use("/chat", require("./routes/chatp2p"));

app.set("view engine", "ejs");

app.get('/home', (req, res)=>{
    // console.log("host ... " + config.apiHost.host_url);
    res.render('home', {host_url : host_url});
});

server.listen(config.apiHost.port, ()=>{
    console.log('⚡️ - Server Running... Listening on: ' + config.apiHost.port);
});

const socketIO = require('socket.io')(server, {cors: {origin:"*"}});


//format of emit 
// 'message'-driver_id-booking_id-admin-id-account_type
// e.g 'message-145-478-92-driver' || 'message-145-478-92-admin'

var allClients = []
socketIO.on("connection", (socket) =>{
    
    allClients.push(socket);
    
    console.log(`⚡️ - ${socket.id} has just connected`);
    console.log(`size clients : ` + allClients.length); 
    // console.log("loggeduser => " +  socket.handshake.query.client);

    socket.on('message-from-driver', async (params) =>{
        console.log('params... ' + params);
        console.log('message : ' + params.message);
        console.log('chat-id : ' + params.chat_id);
        
        //form socket_id emitting to admin (driver - bookingid - admin)
        let socket_emit_id = 'message-'+params.driver_id+'-'+params.booking_id+'-'+params.admin_id+'-admin';

        //add insert in table ...
        let resultsInsert = await messageDb.insertChatMessages(params);
        console.log('Results of Insert ... ', resultsInsert);

        console.log('socket_emit_id from driver going to admin : ' + socket_emit_id);
        socket.broadcast.emit(socket_emit_id, params.message);
    });

    socket.on('message-from-admin', (params) => {
        console.log('params: ' + params);
        console.log('message: ' + params.message);

         //form socket_id emitting to driver (driver - bookingid - admin)
        let socket_emit_id = 'message-'+params.driver_id+'-'+params.booking_id+'-'+params.admin_id+'-driver';

        //add insert in table ...
        let sendMessageWData = {
            "author_id" : params.admin_id,
            "message" : params.message
        };

        console.log('socket_emit_id from admin going to driver : ' + socket_emit_id);
        socket.broadcast.emit(socket_emit_id, sendMessageWData);
    });

    socket.on('disconnect', () => {
        console.log(`Got disconnected... ${socket.id}`);
        
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
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

