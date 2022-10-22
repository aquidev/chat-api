const createConnection =  require("../services/db");
const AppError = require("../utils/appError");


const getMessagesById  = async(params) => {

    const client = await createConnection();
    let results =  {};
    try{
    
        results = await client.query(`select * from MESSAGES limit 1`);
    
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
}