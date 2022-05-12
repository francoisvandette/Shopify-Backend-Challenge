const mysql = require(`mysql`);
const dotenv = require(`dotenv`);
dotenv.config();

const connection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: ``,
    database: `web_app`,
    port: 3306
});

connection.connect((err) => {
    if(err){
        console.log(err.message);
    }
    console.log(`db ` + connection.state);
})