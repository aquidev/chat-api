const express = require('express');
const messageDb = require('../controller/messageDb');
const router = express.Router();


router.get("/testmysql", async (req, res) => {
    try{
        res.status(200).json(await messageDb.getMessagesById());
    }
    catch(err){
        console.error(`Error while getting messages`, err.message);
    }
});


module.exports = router;