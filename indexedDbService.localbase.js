// setup
const dbName = `FrancoisVandette_inventoryDB`;
let db = new Localbase(dbName);

let productExistsResult;

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
    await db.collection(`product`).doc({ProductCode: code}).get().then(product => {
        if(product) {
            productExistsResult = true;
        } else {
            productExistsResult = false;
        }
    })
    
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


// read
async function inventoryGetAll() {
    let i;
    await db.collection(`inventory`).get().then(inventory => {
        i = inventory;
    })
    return i;
}

async function inventoryGetAllWithKeys() {
    let i;
    await db.collection(`inventory`).get({ keys: true }).then(inventory => {
        i = inventory;
    })
    return i;
}


let inventoryCheckRowResult;
async function inventoryDuplicateRowCheck(code, wid) {
    db.collection(`inventory`).doc({ProductCode: code, WarehouseId: wid}).get().then(row => {
        if(row) {
            productExistsResult = true;
        } else {
            productExistsResult = false;
        }
    })
}


// update



// delete
async function inventoryDeleteAllRowsByProductCode(code) {
    db.collection(`inventory`).get().then(inventory => {
        for(let i = 0; i < inventory.length; i++) {
            db.collection('inventory').doc({ ProductCode: code }).delete();
        }
    })
}

async function inventoryDeleteAllRowsByWarehouseId(id) {
    await db.collection(`inventory`).get().then(inventory => {
        for(let i = 0; i < inventory.length; i++) {
            db.collection('inventory').doc({ WarehouseId: id }).delete();
        }
    })
}