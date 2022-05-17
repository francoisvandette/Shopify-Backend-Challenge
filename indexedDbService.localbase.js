// setup
const dbName = `FrancoisVandette_inventoryDB`;
let db = new Localbase(dbName);

function loadTestData() {
    // products
    db.collection(`product`).add({
        ProductCode: `Coke0-355`,
        ProductName: `Coke Zero Can`,
        Description: `Zero sugar Coke, 355mL can`,
        Category: `Diet`
    });
    db.collection(`product`).add({
        ProductCode: `Coke-355`,
        ProductName: `Coke Can`,
        Description: `Regular Coke, 355mL can`,
        Category: `Cola`
    });
    db.collection(`product`).add({
        ProductCode: `Ginger0-355`,
        ProductName: `Diet Ginger Ale Can`,
        Description: `Zero sugar Ginger Ale, 355mL can`,
        Category: `Diet`
    });
    db.collection(`product`).add({
        ProductCode: `7up-355`,
        ProductName: `7 Up Can`,
        Description: `7 Up, 355mL can`,
        Category: `Lemon-Lime`
    });

    // inventory
    db.collection(`inventory`).add({
        ProductCode: `Coke0-355`,
        WarehouseId: `1`,
        ProductLocationQuantity: 0
    });
    db.collection(`inventory`).add({
        ProductCode: `Coke0-355`,
        WarehouseId: `2`,
        ProductLocationQuantity: 1000
    });
    db.collection(`inventory`).add({
        ProductCode: `Coke-355`,
        WarehouseId: `2`,
        ProductLocationQuantity: 100
    });
    db.collection(`inventory`).add({
        ProductCode: `Ginger0-355`,
        WarehouseId: `1`,
        ProductLocationQuantity: 35
    });
    db.collection(`inventory`).add({
        ProductCode: `7up-355`,
        WarehouseId: `2`,
        ProductLocationQuantity: 7
    });

    // warehouses
    warehouseCreate(`1`, `warehouseOne`, `123 Fake St`, `Ottawa`, `ON`, `K2C3K1`, `Canada`);
    warehouseCreate(`2`, `warehouseTwo`, `555 Notareal Place`, `Ottawa`, `ON`, `K2C1J1`, `Canada`);
    warehouseCreate(`3`, `warehouseThree`, `111 Lane Road`, `Vancouver`, `BC`, `V3V3V3`, `Canada`);
}

// Product CRUD
// create
async function productCreate(code, name, desc, categ) {
    db.collection(`product`).add({
        ProductCode: code,
        ProductName: name,
        Description: desc,
        Category: categ
    })
}


// read
async function productGetAll() {
    let p;
    await db.collection(`product`).get().then(products => {
        p = products;
    })
    return p;
}

async function productGetByKey(key) {
    await db.collection(`product`).doc(key.toString()).get().then(product => {
        console.log(product);
    })
}

async function productGetByCode(code) {
    let result;
    await db.collection(`product`).doc({ProductCode: code}).get().then(product => {
        result = product;
        console.log(`productGetByCode: `,product);
    })
    return result;
}

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

// update
async function productEdit(code, name, desc, categ) {
    await db.collection('product').doc({ProductCode: code}).update({
        ProductCode: code,
        ProductName: name,
        Description: desc,
        Category: categ
    })
}


// delete
async function productDeleteByCode(code) {
    await db.collection(`product`).doc({ProductCode: code}).delete();
}



// Warehouse CRUD
// create
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


// read
async function warehouseGetAll() {
    let warehouses;
    await db.collection(`warehouse`).get().then(result => {
        warehouses = result;
    })
    return warehouses;
}

async function warehouseGetById(id) {
    let warehouse;
    await db.collection(`warehouse`).doc({WarehouseId: id}).get().then(result => {
        warehouse = result;
    })
    return warehouse;
}


// update
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


// delete
async function warehouseDeleteById(id) {
    await db.collection(`warehouse`).doc({WarehouseId: id}).delete();
}



// Inventory CRUD
// create
async function inventoryCreate(productCode, warehouseId, quantity) {
    db.collection(`inventory`).add({
        ProductCode: productCode,
        WarehouseId: warehouseId,
        ProductLocationQuantity: quantity
    })
}

// read
async function inventoryGetAll() {
    let i;
    await db.collection(`inventory`).get().then(response => {
        i = response;
    })
    return i;
}

async function inventoryGetAllWithKeys() {
    let i;
    await db.collection(`inventory`).get({ keys: true }).then(response => {
        i = response;
    })
    return i;
}

async function inventoryGetRowByKey(key) {
    let result;
    await db.collection(`inventory`).doc(key.toString()).get().then(row => {
        result = row;
    })
    return result;
}

async function inventoryGetRowByCodeAndID(code, id) {
    let result;
    await db.collection(`inventory`).doc({ProductCode: code, WarehouseId: id}).get({ keys: true }).then(row => {
        result = row;
    })
    return result;
}


// update
async function inventoryUpdateWithKey(key, code, id, quantity) {
    db.collection(`inventory`).doc(key).update({
        ProductCode: code,
        WarehouseId: id,
        ProductLocationQuantity: quantity
    })
}

async function inventoryUpdateWithCodeAndId(code, id, quantity) {
    await db.collection(`inventory`).doc({ProductCode: code, WarehouseId: id}).update({
        ProductCode: code, 
        WarehouseId: id,
        ProductLocationQuantity: quantity
    })
}


// delete
async function inventoryDeleteAllRowsByProductCode(code) {
    db.collection(`inventory`).get().then(invent => {
        for(let i = 0; i < invent.length; i++) {
            db.collection('inventory').doc({ ProductCode: code }).delete();
        }
    })
}

async function inventoryDeleteAllRowsByWarehouseId(id) {
    db.collection(`inventory`).get().then(invent => {
        for(let i = 0; i < invent.length; i++) {
            db.collection(`inventory`).doc({WarehouseId: id}).delete();
        }
    })
}

async function inventoryDeleteRowByKey(key) {
    db.collection(`inventory`).doc(key).delete();
}

async function inventoryDeleteRowByCodeAndId(code, id) {
    await db.collection(`inventory`).doc({ProductCode: code, WarehouseId: id}).delete();
}