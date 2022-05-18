const warehouseTable = document.querySelector(`#warehouse-list`);
const inputId = document.querySelector(`#warehouse-id-input`);
const inputName = document.querySelector(`#warehouse-name-input`);
const inputAddress = document.querySelector(`#warehouse-address-input`);
const inputCity = document.querySelector(`#warehouse-city-input`);
const inputProvince = document.querySelector(`#warehouse-province-input`);
const inputPostal = document.querySelector(`#warehouse-postal-input`);
const inputCountry = document.querySelector(`#warehouse-country-input`);
const editId = document.querySelector(`#warehouse-id-edit`);
const editWarehouseBtn = document.querySelector(`#edit-warehouse-btn`);
const createWarehouseBtn = document.querySelector(`#create-warehouse-btn`);

let editBtns;
let deleteBtns;

// let warehouses;

loadWarehouseInfo();

async function loadWarehouseInfo() {
    // get Warehouse info
    let warehouses = await warehouseGetAll();

    // indicate loading and resetting table contents
    warehouseTable.innerHTML = `<tr><td colspan="9">Loading...</td></tr>`;
    let tableContents = ``;

    // loop to fill table
    for(let i = 0; i < warehouses.length; i++) {
        tableContents += `
        <tr>
            <td>${warehouses[i].WarehouseId}</td>
            <td>${warehouses[i].WarehouseName}</td>
            <td>${warehouses[i].Address}</td>
            <td>${warehouses[i].City}</td>
            <td>${warehouses[i].Province}</td>
            <td>${warehouses[i].PostalCode}</td>
            <td>${warehouses[i].Country}</td>
            <td><button class="edit-btn" value=${warehouses[i].WarehouseId}>Edit</button></td>
            <td><button class="delete-btn" value=${warehouses[i].WarehouseId}>Delete</button></td>
        </tr>
    `;
    }
    warehouseTable.innerHTML = tableContents;

    // gather newly created buttons
    editBtns = document.querySelectorAll(".edit-btn");
    deleteBtns = document.querySelectorAll(".delete-btn");

    // edit button functionality
    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener(`click`, function() {
            warehouseGetById(editBtns[i].value).then(w => {
                editId.innerHTML = w.WarehouseId;
                editId.style.display = `inline`;
                inputId.style.display = `none`;

                // setting values to be edited, placeholders for reminder to user and in event value is null
                inputName.value = w.WarehouseName;
                inputName.placeholder = w.WarehouseName;
                inputAddress.value = w.Address;
                inputAddress.placeholder = w.Address;
                inputCity.value = w.City;
                inputCity.placeholder = w.City;
                inputProvince.value = w.Province;
                inputProvince.placeholder = w.Province;
                inputPostal.value = w.PostalCode;
                inputPostal.placeholder = w.PostalCode;
                inputCountry.value = w.Country;
                inputCountry.placeholder = w.Country;

                // hide create button, reveal edit button
                createWarehouseBtn.style.display = `none`;
                editWarehouseBtn.style.display = `block`;
            })
        });
    }

    // delete button functionality
    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener(`click`, async function() {
            // confirm deleting the warehouse entry
            let con = confirm(`Are you sure you want to delete this warehouse?
                \nThis will also delete all inventory listings for this warehouse.`);

            if(con){
                await warehouseDeleteById(deleteBtns[i].value);
                await inventoryDeleteAllRowsByWarehouseId(deleteBtns[i].value);
            }
            // reload the table
            await loadWarehouseInfo();
        })
    }
}

async function setWarehouseEdit() {
    // gather values to edit the warehouse information
    let id = editId.innerHTML;
    let name = inputName.value || inputName.placeholder;
    let address = inputAddress.value || inputAddress.placeholder;
    let city = inputCity.value || inputCity.placeholder;
    let province = inputProvince.value || inputProvince.placeholder;
    let postal = inputPostal.value || inputPostal.placeholder;
    let country = inputCountry.value || inputCountry.placeholder;
    await warehouseEditById(id, name, address, city, province, postal, country);

    // resetting the form
    inputName.value = inputName.placeholder = ``;
    inputAddress.value = inputAddress.placeholder = ``;
    inputCity.value = inputCity.placeholder = ``;
    inputProvince.value = inputProvince.placeholder = ``;
    inputPostal.value = inputPostal.placeholder = ``;
    inputCountry.value = inputCountry.placeholder = ``;
    editId.innerHTML = ``;
    inputId.style.display = `inline`;
    inputId.value = ``;
    editWarehouseBtn.style.display = `none`;
    createWarehouseBtn.style.display = `block`;

    // reload the table
    await loadWarehouseInfo();
}

editWarehouseBtn.addEventListener(`click`, setWarehouseEdit);

async function createWarehouse() {
    let id = inputId.value.trim();
    let name = inputName.value.trim();
    let address = inputAddress.value.trim();
    let city = inputCity.value.trim();
    let province = inputProvince.value.trim();
    let postal = inputPostal.value.trim();
    let country = inputCountry.value.trim();
    
    // check if any inputs are blank, if true alert and stop the function
    if(id == `` || name == `` || address == `` || city == `` || province == `` || postal == `` || country == ``){
        alert(`Please fill the entire form.`);
        return;
    }

    // checks to see if a warehouse by that Id already exists
    let check = await warehouseGetById(id);
    // if not, create a new wrehouse
    if(!check){
        await warehouseCreate(id, name, address, city, province, postal, country);
        inputId.value = inputName.value = inputAddress.value = ``;
        inputCity.value = inputProvince.value = inputPostal.value = ``;
        inputCountry.value = ``;
        await loadWarehouseInfo();
    } else {
        alert(`Warehouse ID already exists, use a different one.`);
    }
}

createWarehouseBtn.addEventListener(`click`, createWarehouse);