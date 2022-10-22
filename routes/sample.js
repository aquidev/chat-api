const express = require('express');
const router = express.Router();
const messagesQuery =  require('../services/message.db');


router.get("/testmysql", async (req, res) => {
    try{
        res.status(200).json(await messagesQuery.getSample());
    }
    catch(err){
        console.error(`Error while getting messages`, err.message);
    }
});


module.exports = router;