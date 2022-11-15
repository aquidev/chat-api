const createConnection =  require("../services/db");
const AppError = require("../utils/appError");


const insertChatMessages = async(messageObj) =>{

    const client = await createConnection();
    let result_obj = {
        "insert_id" : "",
        "err_message" : ""
    };
    try{
        result_obj = await client.query('INSERT INTO chat_messages SET ?',
        {
            booking_id : messageObj.booking_id, 
            message : messageObj.message,
            created : new Date(),
            modified: new Date(),
            author_id: messageObj.author_id,
            action_by: messageObj.account_type,
            status: 'Unread',
            chat_id :messageObj.chat_id
        }, (err, results, fields)=> {
            let err_message = '';
            let result_id = '';
            if(err){
                console.error(err.message);
                err_message = err.message;
            }
            else{
                console.log('Message ID insert : ' + results.insertId);
                result_id = results.insertId;
            }
            return  {
                "insert_id" : result_id,
                "err_messsage" : err_message
            }
        })
    }
    catch(e){
        console.log(e);
    }
    finally{

        await client.close();
        return result_obj;

    }

}

const getMessagesById  = async() => {

    const client = await createConnection();
    let results =  {};
    try{
    
        results = await client.query(`select * from messages limit 1`);
        // console.log(results);
    
    }
    catch(e){

        console.error(e);
    
    }
    finally{

        await client.close();
        return results;
    }


}

const getChatAdminDriverP2pByIds = async(_bookingId, _adminId, _driverId) => {

    const client = await createConnection();
    let results = {};
    try{
    
        results = await client.query(`select id, booking_id, 
        created, modified, admin_id, driver_id, started_by, status
        from chat_p2p where booking_id=${_bookingId} and admin_id=${_adminId} and driver_id=${_driverId}`);
        // console.log(results);
    
    }
    catch(e){

        console.error(e);
    
    }
    finally{

        await client.close();
        return results;
    }

}

const getChatMessagesByChatId = async(_chatId) => {

    const client = await createConnection();
    let results = {};
    try{

        results = await client.query(`select id, message, created, modified, author_id, status, message_type 
        from chat_messages where chat_id=${_chatId} order by created`);


    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close();
        return results;
    }

}

module.exports = {
    getMessagesById : getMessagesById,
    getChatAdminDriverP2pByIds : getChatAdminDriverP2pByIds,
    getChatMessagesByChatId : getChatMessagesByChatId,
    insertChatMessages : insertChatMessages
}