const express = require('express');
const multer = require('multer');
const messageDb = require('../controller/messageDb');
const router = express.Router();
const upload = multer();


router.post("/getMessages", upload.none(), async(req, res) => {
    console.log('get messages with bookingid adminid and driverid');
    console.log('requests.... ' , req.body);
    let results_map = {"messages":[]};
    try{

        const results_chat_p2p = await messageDb.getChatAdminDriverP2pByIds(req.body.booking_id, req.body.admin_id, req.body.driver_id);
        // console.log('results from chat p2p====> ' + results_chat_p2p , results_chat_p2p[0].id);
        const chat_messages = await messageDb.getChatMessagesByChatId(results_chat_p2p[0].id);
        // console.log('chatmessage >>>> ', chat_messages);
        // let _messagesTemp = [...chat_messages];
        // console.log('array of messages. .. ', _messagesTemp);
        if(chat_messages){
            let m = JSON.parse(JSON.stringify(chat_messages));
            console.log("messages in array parsed >>>", m);
            results_map = results_chat_p2p[0];
            results_map["messages"] = m;
        }
        // let results_chat_p2p_w_messages = { ...results_chat_p2p, messages: [...chat_messages]};
        console.log('resultes after ... ', results_map);
        return res.status(200).json(results_map);

    }
    catch(err){
        console.error(`Error while getting messages`, err.message);
    }
});

module.exports = router;