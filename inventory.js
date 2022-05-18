const inventoryList = document.querySelector(`#inventory-list`);
const productDropDown = document.querySelector(`#product-dropdown`);
const warehouseDropDown = document.querySelector(`#warehouse-dropdown`);
const quantityValue = document.querySelector(`#quantity`);
const quantityAttention = document.querySelector(`#quantity-attention`);
const inventoryKeySpan = document.querySelector(`#inventory-key`);
const editInventoryBtn = document.querySelector(`#edit-inventory-btn`);
const addInventoryBtn = document.querySelector(`#add-inventory-btn`);

var products;
var warehouses;
let inventory;

let editBtns;
let deleteBtns;

// startup
// gathers the product and warehouse tables once, user can not change or delete them from this page
(async function() {
    products = await productGetAll();
    warehouses = await warehouseGetAll();
    await loadInventory();
})();


// loads the inventory table
async function loadInventory() {

    // loads the Product dropdown menu
    productDropDown.innerHTML = ``;
    let productDisplay = `<option disabled selected value> -- select a product -- </option>`;
    for(let i = 0; i < products.length; i++) {
        productDisplay += `
            <option value="${products[i].ProductCode}">${products[i].ProductCode}, 
                    ${products[i].ProductName}, ${products[i].Category}</option>
        `;
    }
    productDropDown.innerHTML = productDisplay;

    // loads the Warehouse dropdown menu
    warehouseDropDown.innerHTML = ``;
    let warehouseDisplay = `<option disabled selected value> -- select a warehouse -- </option>`;
    for(let i = 0; i < warehouses.length; i++) {
        warehouseDisplay += `
            <option value="${warehouses[i].WarehouseId}">${warehouses[i].WarehouseId}, 
                    ${warehouses[i].WarehouseName}, ${warehouses[i].City}</option>
        `;
    }
    warehouseDropDown.innerHTML = warehouseDisplay;

    // loading the Inventory table
    inventory = await inventoryGetAll();
    inventoryList.innerHTML = `<tr><td colspan="8">Loading...</td></tr>`;
    let tableRow = ``;

    // go through each inventory row and makes a row in the table
    for(let i = 0; i < inventory.length; i++) {
        // use the ProductCode in the Inventory row to display product related data from the ProductCde
        let product = await productGetByCode(inventory[i].ProductCode);
        // use the WarehouseId in the Inventory row to display warehoure related data from the WarehouseId
        let warehouse = await warehouseGetById(inventory[i].WarehouseId);
        tableRow += `
            <tr>
                <td>${product.ProductCode}</td>
                <td>${product.ProductName}</td>
                <td>${product.Category}</td>
                <td>${warehouse.WarehouseName}</td>
                <td>${warehouse.City}</td>
                <td>${inventory[i].ProductLocationQuantity}</td>
                <td><button class="edit-btn" data-code="${inventory[i].ProductCode}" data-id="${inventory[i].WarehouseId}">Edit</button></td>
                <td><button class="delete-btn" data-code="${inventory[i].ProductCode}" data-id="${inventory[i].WarehouseId}">Delete</button></td>
            </tr>
        `;
    }
    inventoryList.innerHTML = tableRow;

    // gathers newly created Edit and Delete buttons
    editBtns = document.querySelectorAll(`.edit-btn`);
    deleteBtns = document.querySelectorAll(`.delete-btn`);

    // edit button functionality
    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener(`click`, async function() {
            // gets the information and places it in the form section
            let row = await inventoryGetRowByCodeAndID(editBtns[i].dataset.code, editBtns[i].dataset.id);
            productDropDown.value = row.ProductCode;
            productDropDown.disabled = true;
            warehouseDropDown.value = row.WarehouseId;
            warehouseDropDown.disabled = true;
            quantityValue.value = row.ProductLocationQuantity;
            addInventoryBtn.style.display = `none`;
            editInventoryBtn.style.display = `block`;
            quantityAttention.innerHTML = `Please set the new quantity`
        })
    }

    // delete button functionality
    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener(`click`, async function() {
            // confirms with the user before deleting
            let con = confirm(`Are you sure you want to delete this inventory entry?`);
            if(con){
                await inventoryDeleteRowByCodeAndId(deleteBtns[i].dataset.code, deleteBtns[i].dataset.id);
                // reloads the table
                await loadInventory();
            }
        })
    }
}

async function inventoryAdd() {
    let code = productDropDown.value;
    let warehouse = warehouseDropDown.value;
    let rowCheck = await inventoryGetRowByCodeAndID(code, warehouse);

    // check to see if any values are blank, if so alert user and exit function
    if(code == `` || warehouse == `` || quantityValue.value == ``){
        alert(`Please fill the entire form.`);
        return;
    }

    // check if there is already an entry for the product at that warehouse, keeps ProductCode and WarehouseId combo unique
    if(rowCheck){
        if(confirm(`Product already at this warehouse, would you like to update?`)){
            // loads data into the form
            productDropDown.disabled = true;
            warehouseDropDown.disabled = true;
            addInventoryBtn.style.display = `none`;
            editInventoryBtn.style.display = `block`;
            quantityAttention.innerHTML = `Please set the new quantity`
        } else {
            // resets the form
            productDropDown.value = ``;
            productDropDown.disabled = false;
            warehouseDropDown.value = ``;
            warehouseDropDown.disabled = false;
            quantityValue.value = ``;
            quantityAttention.innerHTML = ``;
        }
    } else {
        // if the ProductCode and WarehouseId combo does not already exist, then create and reset the form
        await inventoryCreate(code, warehouse, quantity.value.trim()).then(response => {
            productDropDown.value = ``;
            productDropDown.disabled = false;
            warehouseDropDown.value = ``;
            warehouseDropDown.disabled = false;
            quantityValue.value = ``;
            quantityAttention.innerHTML = ``;
            // reload the table
            loadInventory();
        });
    }
}

addInventoryBtn.addEventListener(`click`, inventoryAdd);

async function inventoryEdit() {
    let code = productDropDown.value;
    let warehouse = warehouseDropDown.value;
    let quantity = quantityValue.value;

    // check to see quantity is not blank
    if(quantity == ``){
        alert(`Please enter a quantity.`);
        return;
    }

    // updates the inventory row
    await inventoryUpdateWithCodeAndId(code, warehouse, quantity).then(response => {
        productDropDown.value = ``;
        productDropDown.disabled = false;
        warehouseDropDown.value = ``;
        warehouseDropDown.disabled = false;
        quantityValue.value = ``;
        quantityAttention.innerHTML = ``;
        editInventoryBtn.style.display = `none`;
        addInventoryBtn.style.display = `block`;
        loadInventory();
    }).catch(error => {
        // do nothing
    })

}

editInventoryBtn.addEventListener(`click`, inventoryEdit);