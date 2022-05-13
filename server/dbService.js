const mysql = require(`mysql`);
// const dotenv = require(`dotenv`);
// dotenv.config();

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
    // connection.query(sql)
})

module.exports = connection;

// connection.query
function getAll() {
    let sql = `SELECT * FROM names`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`Result: ` + result);
    });
}

getAll();

function deleteRow(name) {
    let sql = `DELETE FROM names WHERE name = ?`;
    connection.query(sql, [name], function (err, result) {
        if (err) throw err;
        getAll();
    })
}

deleteRow('test');