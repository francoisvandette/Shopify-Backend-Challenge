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
        WarehouseId: 1,
        ProductLocationQuantity: 0
    });
    db.collection(`inventory`).add({
        ProductCode: `Coke0-355`,
        WarehouseId: 2,
        ProductLocationQuantity: 1000
    });
    db.collection(`inventory`).add({
        ProductCode: `Coke-355`,
        WarehouseId: 2,
        ProductLocationQuantity: 100
    });
    db.collection(`inventory`).add({
        ProductCode: `Ginger0-355`,
        WarehouseId: 1,
        ProductLocationQuantity: 35
    });
    db.collection(`inventory`).add({
        ProductCode: `7up-355`,
        WarehouseId: 2,
        ProductLocationQuantity: 7
    });
}

// Product CRUD
// create
function productCreate(code, name, desc, categ) {
    db.collection(`product`).add({
        ProductCode: code,
        ProductName: name,
        Description: desc,
        Category: categ
    })
}


// read


function productGetByKey(key) {
    db.collection.doc(key.toString()).get().then(product => {
        console.log(product);
    })
}

// update
async function productEdit(code, name, desc, categ) {
    db.collection('product').doc({ProductCode: code}).update({
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



// read



// update



// delete




// Inventory CRUD
// create


// read
function returnInventory() {
    db.collection(`inventory`).get().then(inventory => {
        return inventory;
    })
}

// update



// delete
async function inventoryDeleteAllRowsByProductCode(code) {
    db.collection(`inventory`).get().then(inventory => {
        for(let i = 0; i < inventory.length; i++) {
            db.collection('inventory').doc({ ProductCode: code }).delete()
        }
    })
}