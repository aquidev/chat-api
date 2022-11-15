const createConnection =  require("../services/db");
const AppError = require("../utils/appError");


const getTruckAssignment  = async(_id) => {

    const client = await createConnection();
    let results =  {};
    try{
    
        results = await client.query(`select * from truck_booking_assignments where booking_id=${_id} order by id desc`);
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

module.exports = {
    getTruckAssignment : getTruckAssignment,
}