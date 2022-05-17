let inventoryList = document.querySelector(`#inventory-list`);
let productDropDown = document.querySelector(`#product-dropdown`);
let warehouseDropDown = document.querySelector(`#warehouse-dropdown`);

loadInventory();

async function loadInventory() {
    let products = await productGetAll();
    let warehouses = await warehouseGetAll();
    let inventory = await inventoryGetAllWithKeys();

    productDropDown.innerHTML = ``;
    let productDisplay = `<option disabled selected value> -- select a product -- </option>`;
    for(let i = 0; i < products.length; i++) {
        productDisplay += `
            <option value="${products[i].ProductCode}">${products[i].ProductCode}, ${products[i].ProductName}, ${products[i].Category}</option>
        `;
    }
    productDropDown.innerHTML = productDisplay;

    warehouseDropDown.innerHTML = ``;
    let warehouseDisplay = `<option disabled selected value> -- select a warehouse -- </option>`;
    for(let i = 0; i < warehouses.length; i++) {
        warehouseDisplay += `
        <option value="${warehouses[i].WarehouseId}">${warehouses[i].WarehouseId}, ${warehouses[i].WarehouseName}, ${warehouses[i].City}</option>
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

        inventoryList.innerHTML = tableRow;

    
    }



}