const mysql = require('mysql');
const util = require('util');

var config = require('../config');

// const conn = mysql.createConnection(config.db);

// conn.connect((err)=>{
//     if(err) console.log(err);
//     console.log('Connected to MySQL!');
// })

// connection.

// conn.connect();

const createConnection = async() => {

    const connection = mysql.createConnection(config.db);
    
    return {
        query(sql, args){
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close(){
            return util.promisify(connection.end).call(connection);
        }

    }
}

module.exports = createConnection

// async function query(sql, params){
//     const [rows, fields] = await conn.query(sql, params);
//     return rows;
// }

// module.exports = {
//     conn
// }