// setup
const dbName = `FrancoisVandette_inventoryDB`;
let db = new Localbase(dbName);

// loads test data
async function loadTestData() {
    // products
    await productCreate(`Coke0-355`, `Coke Zero Can`, `Zero sugar Coke, 355mL can`, `Diet`);
    await productCreate(`Coke-355`, `Coke Can`, `Regular Coke, 355mL can`, `Cola`);
    await productCreate(`Ginger0-355`, `Diet Ginger Ale Can`, `Zero sugar Ginger Ale, 355mL can`, `Diet`);
    await productCreate(`7up-355`, `7 Up Can`, `7 Up, 355mL can`, `Lemon-Lime`);

    // inventory
    await inventoryCreate(`Coke0-355`, `1`, 0);
    await inventoryCreate(`Coke0-355`, `2`, 1000);
    await inventoryCreate(`Coke-355`, `2`, 100);
    await inventoryCreate(`Ginger0-355`, `1`, 35);
    await inventoryCreate(`7up-355`, `2`, 7);

    // warehouses
    await warehouseCreate(`1`, `Home Warehouse`, `123 Fake St`, `Ottawa`, `ON`, `K2C3K1`, `Canada`);
    await warehouseCreate(`2`, `Riverside`, `555 Notareal Place`, `Ottawa`, `ON`, `K2C1J1`, `Canada`);
    await warehouseCreate(`3`, `WetCoast`, `111 Lane Road`, `Vancouver`, `BC`, `V3V3V3`, `Canada`);
}

// deletes the entire database
async function deleteAllData() {
    await db.delete();
}



// Product CRUD

// Product CREATE
// creates one product
async function productCreate(code, name, desc, categ) {
    await db.collection(`product`).add({
        ProductCode: code,
        ProductName: name,
        Description: desc,
        Category: categ
    })
}


// Product READ
// returns all products in the table
async function productGetAll() {
    let p;
    await db.collection(`product`).orderBy(`ProductCode`,`asc`).get().then(products => {
        p = products;
    })
    return p;
}

// returns one product by ProductCode
async function productGetByCode(code) {
    let result;
    await db.collection(`product`).doc({ProductCode: code}).get().then(product => {
        result = product;
    })
    return result;
}

// checks to see if a product exists by using the ProductCode
async function productExists(code) {
    let result;
    await db.collection(`product`).doc({ProductCode: code}).get().then(product => {
        if(product) {
            result = true;
        } else {
            result = false;
        }
    })
    return result;
}


// Product UPDATE
// updates the product by ProductCode
async function productEdit(code, name, desc, categ) {
    await db.collection('product').doc({ProductCode: code}).update({
        ProductCode: code,
        ProductName: name,
        Description: desc,
        Category: categ
    })
}


// Product DELETE
// deleted a product by ProductCode
async function productDeleteByCode(code) {
    await db.collection(`product`).doc({ProductCode: code}).delete();
}



// Warehouse CRUD

// Warehouse CREATE
// creates a new warehouse
async function warehouseCreate(id, name, add, city, prov, postal, country) {
    await db.collection(`warehouse`).add({
        WarehouseId: id,
        WarehouseName: name,
        Address: add,
        City: city,
        Province: prov,
        PostalCode: postal,
        Country: country
    })
}


// Warehouse READ
// returns all warehouse rows from the Warehouse table
async function warehouseGetAll() {
    let warehouses;
    await db.collection(`warehouse`).orderBy(`WarehouseId`,`asc`).get().then(result => {
        warehouses = result;
    })
    return warehouses;
}

// returns one warehouse by WarehouseId
async function warehouseGetById(id) {
    let warehouse;
    await db.collection(`warehouse`).doc({WarehouseId: id}).get().then(result => {
        warehouse = result;
    })
    return warehouse;
}


// Warehouse UPDATE
// updates a warehouse by WarehouseId
async function warehouseEditById(id, name, add, city, prov, postal, country) {
    await db.collection(`warehouse`).doc({WarehouseId: id}).update({
        WarehouseName: name,
        Address: add,
        City: city,
        Province: prov,
        PostalCode: postal,
        Country: country
    })
}


// Warehouse DELETE
// deletes a warehouse by WarehouseId
async function warehouseDeleteById(id) {
    await db.collection(`warehouse`).doc({WarehouseId: id}).delete();
}



// Inventory CRUD

// Inventory CREATE
// creates one inventory row
async function inventoryCreate(productCode, warehouseId, quantity) {
    await db.collection(`inventory`).add({
        ProductCode: productCode,
        WarehouseId: warehouseId,
        ProductLocationQuantity: quantity
    })
}


// Inventory READ
// returns all Inventory rows
async function inventoryGetAll() {
    let i;
    await db.collection(`inventory`).orderBy(`WarehouseId`,`asc`).orderBy(`ProductCode`,`asc`).get().then(response => {
        i = response;
    })
    return i;
}

// returns one Inventory row by ProductCode & WarehouseId
async function inventoryGetRowByCodeAndID(code, id) {
    let result;
    await db.collection(`inventory`).doc({ProductCode: code, WarehouseId: id}).get({ keys: true }).then(row => {
        result = row;
    })
    return result;
}


// Inventory UPDATE
// updates the Inventory row by ProductCode & WarehouseId, needs quantity to update quantity
async function inventoryUpdateWithCodeAndId(code, id, quantity) {
    await db.collection(`inventory`).doc({ProductCode: code, WarehouseId: id}).update({
        ProductCode: code, 
        WarehouseId: id,
        ProductLocationQuantity: quantity
    })
}


// Inventory DELETE
// deletes ALL Inventory rows by ProductCode
async function inventoryDeleteAllRowsByProductCode(code) {
    db.collection(`inventory`).get().then(invent => {
        for(let i = 0; i < invent.length; i++) {
            db.collection(`inventory`).doc({ ProductCode: code }).delete();
        }
    })
}

// deletes ALL Inventory rows by WarehouseId
async function inventoryDeleteAllRowsByWarehouseId(id) {
    db.collection(`inventory`).get().then(invent => {
        for(let i = 0; i < invent.length; i++) {
            db.collection(`inventory`).doc({ WarehouseId: id }).delete();
        }
    })
}

// delete one Inventory row by ProductCode & WarehouseId
async function inventoryDeleteRowByCodeAndId(code, id) {
    await db.collection(`inventory`).doc({ProductCode: code, WarehouseId: id}).delete();
}