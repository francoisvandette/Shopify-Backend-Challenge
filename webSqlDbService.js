const db = openDatabase(
    `francois_inventory_management`, 
    `1.0`, 
    `inventory manager for shopify internship application`, 
    2 * 1024 * 1024
    );

window.addEventListener(`load`, function () {
    // create Product Table
    db.transaction(function(transcation) {
        const sql = `CREATE TABLE IF NOT EXISTS product (
            ProductId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            ProductCode VARCHAR(10) NOT NULL,
            ProductName VARCHAR(100) NOT NULL,
            Description VARCHAR(255) NOT NULL,
            Category VARCHAR(20) NOT NULL)`;
        transcation.executeSql(sql, undefined, function() {
            console.log(`Product Table created successfully`);
        }, function() {
            console.log(`Product Table already exists.`);
        });
    });
    // create Warehouse Table
    db.transaction(function(transaction) {
        const sql = `CREATE TABLE IF NOT EXISTS warehouse (
            WarehouseId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            WarehouseName VARCHAR(50) NOT NULL,
            Address VARCHAR(255) NOT NULL,
            City VARCHAR(50) NOT NULL,
            ProvinceState VARCHAR(4) NOT NULL,
            PostalCode VARCHAR(6) NOT NULL,
            Country VARCHAR(60) NOT NULL)`;
        transaction.executeSql(sql, undefined, function() {
            console.log(`Warehouse Table created successfully`);
        }, function() {
            console.log(`Warehouse Table already exists`);
        });
    });
    // create Inventory Table
    db.transaction(function(transaction) {
        const sql = `CREATE TABLE IF NOT EXISTS inventory (
            InventoryId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            WarehouseName VARCHAR(50) NOT NULL,
            Address VARCHAR(255) NOT NULL,
            City VARCHAR(50) NOT NULL,
            ProvinceState VARCHAR(4) NOT NULL,
            PostalCode VARCHAR(6) NOT NULL,
            Country VARCHAR(60) NOT NULL)`;
        transaction.executeSql(sql, undefined, function() {
            console.log(`Warehouse Table created successfully`);
        }, function() {
            console.log(`Warehouse Table already exists`);
        });
    });
})

// insert



// delete
function deleteRowById(table, id) {
    const sql = `DELETE FROM ? WHERE id = ?`;
    transaction.executeSql(sql, [table, id], function() {
        
    }, function(transaction, err){
        console.log(err.message);
    })

}