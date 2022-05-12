const connection = require(`../dbService`);

async function getAll() {
    const sql = "SELECT * FROM names";
    const [rows] = await connection.promise().query(sql);
    return rows;
} 

console.table(getAll());