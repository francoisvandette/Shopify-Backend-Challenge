const inventoryList = document.querySelector(`#inventory-list`);
const productDropDown = document.querySelector(`#product-dropdown`);
const warehouseDropDown = document.querySelector(`#warehouse-dropdown`);
const quantityValue = document.querySelector(`#quantity`);
const inventoryKeySpan = document.querySelector(`#inventory-key`);

let editBtns;
let deleteBtns;

loadInventory();

async function loadInventory() {
    let products = await productGetAll();
    products = await productGetAll();
    let warehouses = await warehouseGetAll();
    let inventory = await inventoryGetAllWithKeys();
    

    productDropDown.innerHTML = ``;
    let productDisplay = `<option disabled selected value> -- select a product -- </option>`;
    for(let i = 0; i < products.length; i++) {
        productDisplay += `
            <option value="${products[i].ProductCode}">${products[i].ProductCode}, 
                    ${products[i].ProductName}, ${products[i].Category}</option>
        `;
    }
    productDropDown.innerHTML = productDisplay;

    warehouseDropDown.innerHTML = ``;
    let warehouseDisplay = `<option disabled selected value> -- select a warehouse -- </option>`;
    for(let i = 0; i < warehouses.length; i++) {
        warehouseDisplay += `
            <option value="${warehouses[i].WarehouseId}">${warehouses[i].WarehouseId}, 
                    ${warehouses[i].WarehouseName}, ${warehouses[i].City}</option>
        `;
    }
    warehouseDropDown.innerHTML = warehouseDisplay;

    inventoryList.innerHTML = `<tr><td colspan="8">Loading...</td></tr>`;
    let tableRow = ``;

    // go through each inventory row
    for(let i = 0; i < inventory.length; i++) {
        let product = await productGetByCode(inventory[i].data.ProductCode);
        let warehouse = await warehouseGetById(inventory[i].data.WarehouseId);
        tableRow += `
            <tr>
                <td>${product.ProductCode}</td>
                <td>${product.ProductName}</td>
                <td>${product.Category}</td>
                <td>${warehouse.WarehouseName}</td>
                <td>${warehouse.City}</td>
                <td>${inventory[i].data.ProductLocationQuantity}</td>
                <td><button class="edit-btn" value="${inventory[i].key}">Edit</button></td>
                <td><button class="delete-btn" value="${inventory[i].key}">Delete</button></td>
            </tr>
        `;
    }

    inventoryList.innerHTML = tableRow;

    editBtns = document.querySelectorAll(`.edit-btn`);
    deleteBtns = document.querySelectorAll(`.delete-btn`);

    // edit button functionality
    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener(`click`, async function() {
            let row = await inventoryGetRowByKey(editBtns[i].value);
            productDropDown.value = row.ProductCode;
            productDropDown.disabled = true;
            warehouseDropDown.value = row.WarehouseId;
            warehouseDropDown.disabled = true;
            quantityValue.value = row.ProductLocationQuantity;
        })
    }

    // delete button functionality
    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener(`click`, async function() {
            let con = confirm(`Are you sure you want to delete this inventory entry?`);
            if(con){
                await inventoryDeleteRowByKey(deleteBtns[i].value);
                await loadInventory();
            }
            
            
        })
    }

}

async function inventoryAdd() {
    let code = productDropDown.value;
    let warehouse = warehouseDropDown.value;
    let rowCheck = await inventoryDuplicateRowCheck(code, warehouse);

    if(rowCheck){
        if(confirm(`Product already at this warehouse, would you like to update?`)){
            // yes
            // load the product code and warehouse id into the dropdowns, disabled = true them
            // set the quantity input's placeholder to be the value
            // add a span that draws attention to the quantity input, maybe even set the focus.
        } else {
            // no
            // clear the inputs?
        }
        // await inventoryUpdateWithCodeAndId(rowCheck.ProductCode, rowCheck.WarehouseId, quantityValue);
        // await loadInventory();
    } else {
        await inventoryCreate(code, warehouse, quantity.value);
        await loadInventory();

        // clear the inputs
    }
}