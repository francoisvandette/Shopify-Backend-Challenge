// let db = null;
let dbCreate = indexedDB.open(`FrancoisVandette_inventoryDB`, 7);
let productTable = null;
let warehouseTable = null;
let inventoryTable = null;

// error event
dbCreate.addEventListener(`error`, (error) => {
    console.warn(error);
});

// success event
dbCreate.addEventListener(`success`, (event) => {
    db = event.target.result;
    console.log(`success`, db);
})

// upgradeneeded event
dbCreate.addEventListener(`upgradeneeded`, (event) => {
    db = event.target.result;
    let oldVersion = event.oldVersion;
    let newVersion = event.newVersion || db.version;
    console.log(`Database upgraded from ` + oldVersion + ` to ` + newVersion);
    console.log(`upgrade`, db);

    if(!db.objectStoreNames.contains(`product`)) {
        productTable = db.createObjectStore(`product`, {
            keyPath: `ProductId`, autoIncrement:true
        });

        productTable.createIndex(`ProductNameIDX`, `ProductName`, {unique: false});
        productTable.createIndex(`ProductCategoryIDX`, `Category`, {unique: false});
    }

    if(!db.objectStoreNames.contains(`warehouse`)) {
        warehouseTable = db.createObjectStore(`warehouse`, {
            keyPath: `WarehouseId`, autoIncrement:true
        });

        warehouseTable.createIndex(`WarehouseNameIDX`, `WarehouseName`, {unique: false});
        warehouseTable.createIndex(`WarehouseCityIDX`, `City`, {unique: false});
        warehouseTable.createIndex(`WarehouseProvinceIDX`, `Province`, {unique: false});
        warehouseTable.createIndex(`WarehouseCountryIDX`, `Country`, {unique: false});
    }

    if(!db.objectStoreNames.contains(`inventory`)) {
        inventoryTable = db.createObjectStore(`inventory`, {
            keyPath: `InventoryId`, autoIncrement:true
        });

        inventoryTable.createIndex(`ProductIDX`, `ProductId`, {unique: false});
        inventoryTable.createIndex(`WarehouseIDX`, `WarehouseId`, {unique: false});
    }
});

function connectTransaction(table, mode) {
    let tx = db.transaction(table, mode);
    tx.onerror = (error) => {
        console.warn(error);
    };
    return tx;
}

// Product CRUD

function getAllProducts() {
    let list = document.querySelector(`#product-list`);
    list.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;

    let transx = connectTransaction(`product`, `readonly`);
    transx.oncomplete = (event) => {
        console.log(`product list returned`);

        // let spans = document.querySelectorAll(`span.quantity`);
        // console.log(spans);
        // let ids = document.querySelectorAll(`td.pid`);
        // console.log(ids);

        // for(let i = 0; i < ids.length; i++) {
        //     console.log(getTotalQuantityForProductId(ids[i].innerHTML));
        //     console.log(sum);
        // }
    }

    let tableProducts = transx.objectStore(`product`);
    let requestProducts = tableProducts.getAll();
    requestProducts.onsuccess = (event) => {
        // let tempresult = event.target;
        // console.log({tempresult});
        let result = event.target.result;
        // console.log({result});

        let tableContents = ``;
        for(let i = 0; i < result.length; i++) {
            tableContents += `
                <tr>
                    <td class="pid">${result[i].ProductId}</td>
                    <td>${result[i].ProductName}</td>
                    <td>${result[i].Description}</td>
                    <td>${result[i].Category}</td>
                    <td><span class="quantity"></span></td>
                    <td><button class="edit-btn" value=${result[i].ProductId}>Edit</td>
                    <td><button class="delete-btn" value=${result[i].ProductId}>Delete</td>
                </tr>
                `;
        }

        list.innerHTML = tableContents;
        // grabbing the button elements as it has updated
        editBtns = document.querySelectorAll(".edit-btn");
        deleteBtns = document.querySelectorAll(".delete-btn");

        // let spans = document.querySelectorAll(`span.quantity`);
        // console.log(spans);
        // for(let i = 0; i < spans.length; i++) {
    
        //     let value = getTotalQuantityForProductId(i+1);
        //     console.log(value);
        //     spans[i].innerHTML = value.toString();
        // }
    }
    requestProducts.onerror = (error) => {
        console.warn(error)
    }
}

let fvtest;
var sum;
function getTotalQuantityForProductId(productId) {
    let transx = connectTransaction(`inventory`, `readonly`);
    transx.oncomplete = (event) => {
        console.log(`quantity returned for`, productId);
        return sum;
    }

    let tableInventory = transx.objectStore(`inventory`);
    let idx = tableInventory.index(`ProductIDX`);
    let requestProducts = idx.getAll(parseInt(productId));
    let sum = 0;
    let test;
    requestProducts.onsuccess = (event) => {
        let result = event.target.result;
        fvtest = result;
        test = result;
        // console.log({result});
        sum = 0;
        for(let i = 0; i < result.length; i++) {
            sum += result[i].ProductLocationQuantity;
        }
        // console.log(sum);
        // let spans = document.querySelectorAll(`#`)
        // return test;
    }
    requestProducts.onerror = (error) => {
        console.warn(error)
    }
    // return test;
}

function getTotalQuantityForAll() {
    let pid = document.querySelectorAll(`td.pid`);
    let idNums = [];
    for(let i = 0; i < pid.length; i++) {
        idNums.push(pid[i].innerHTML);
    }
    console.log(`idNums`, idNums);
    console.log(idNums[12]);


    transx = connectTransaction(`inventory`, `readonly`);
    transx.oncomplete = (event) => {
        // console.log(`quantity returned for`, productId);
    }

    let tableInventory = transx.objectStore(`inventory`);
    let idx = tableInventory.index(`ProductIDX`);
    let requestProducts = idx.getAll();
    let sum = 0;
    requestProducts.onsuccess = (event) => {
        let result = event.target.result;
        console.log({result});
        
        for(let i = 0; i < result.length; i++) {
            sum += result[i].ProductLocationQuantity;
        }
        console.log(sum);
        // let spans = document.querySelectorAll(`#`)
    }
    requestProducts.onerror = (error) => {
        console.warn(error)
    }
}

function getProductByName(name) {
    let list = document.querySelector(`#product-list`);
    list.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;

    let transx = connectTransaction(`product`, `readonly`);
    transx.oncomplete = (event) => {
        console.log(`product listbyname returned for`, name);
    }

    // let tableInventory = transx.objectStore(`inventory`);
    // let requestInventory = tableInventory.getAll();
    // let inventoryAmounts;
    // requestInventory.onsuccess = (event) => {
    //     let requestInventoryResults = event.target.result;
    //     // for each item,
    //         // look at the ProductId, and add to a total
    //     let map = new Map();
    //     for(let i = 0; i < requestInventoryResults.length; i++) {

    //     }
    // }
    // requestInventory.onerror = (error) => {
    //     console.warn(error)
    // }

    let tableProducts = transx.objectStore(`product`);
    let idx = tableProducts.index(`ProductNameIDX`);
    let requestProducts = idx.getAll(name);
    requestProducts.onsuccess = (event) => {
        // let tempresult = event.target;
        // console.log({tempresult});
        let result = event.target.result;
        console.log({result});

        let tableContents = ``;
        for(let i = 0; i < result.length; i++) {

            // get(ProductCode) 

            tableContents += `
                <tr>
                    <td>${result[i].ProductId}</td>
                    <td>${result[i].ProductName}</td>
                    <td>${result[i].Description}</td>
                    <td>${result[i].Category}</td>
                    <td>${getTotalQuantityForProductId(result[i].ProductId)}</td>
                    <td><button class="edit-btn" value=${result[i].ProductId}>Edit</td>
                    <td><button class="delete-btn" value=${result[i].ProductId}>Delete</td>
                </tr>`;
        }

        list.innerHTML = tableContents;
        // grabbing the button elements as it has updated
        editBtns = document.querySelectorAll(".edit-btn");
        deleteBtns = document.querySelectorAll(".delete-btn");
    }
    requestProducts.onerror = (error) => {
        console.warn(error)
    }
}

function createProduct(name, desc, categ) {
    let product = {
        ProductName: name,
        Description: desc,
        Category: categ
    };

    let transx = connectTransaction(`product`, `readwrite`);

    let table = transx.objectStore(`product`);
    let request = table.add(product);
    request.onsuccess = (event) => {
        console.log(`product created`);
    }
    request.onerror = (error) => {
        console.warn(`error in creating product`);
        console.warn(error);
    }
}

function updateProduct(id, name, desc, categ) {

}

function deleteProduct(id) {

}



// Warehouse CRUD
function createWarehouse(name, address, city, state, postal, country) {

}

function updateWarehouse(id, name, address, city, state, postal, country) {

}

function deleteWarehouse(id) {

}




// Invetory CRUD

function getInventoryRowsForProduct(productId) {

}

function createInventory(productId, warehouseId, localQuantity) {
    let inventoryRow = {
        ProductId: productId,
        WarehouseId: warehouseId,
        ProductLocationQuantity: localQuantity
    };

    let transx = connectTransaction(`inventory`, `readwrite`);

    let table = transx.objectStore(`inventory`);
    let request = table.add(inventoryRow);
    request.onsuccess = (event) => {
        console.log(`inventory row created`);
    }
    request.onerror = (error) => {
        console.warn(`error in creating product`);
        console.warn(error);
    }
}

function updateInventory(id, productId, warehouseId, localQuantity) {

}

function deleteInventory(id) {

}