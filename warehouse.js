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

    // indicate loading and allows
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

    editBtns = document.querySelectorAll(".edit-btn");
    deleteBtns = document.querySelectorAll(".delete-btn");

    // edit button functionality
    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener(`click`, function() {
            warehouseGetById(editBtns[i].value).then(w => {
                editId.innerHTML = w.WarehouseId;
                editId.style.display = `inline`;
                inputId.style.display = `none`;

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

                createWarehouseBtn.style.display = `none`;
                editWarehouseBtn.style.display = `block`;
            })
        });
    }

    // delete button functionality
    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener(`click`, async function() {
            let con = confirm(`Are you sure you want to delete this warehouse?`);
            if(con){
                await warehouseDeleteById(deleteBtns[i].value);
            }
            if(con && confirm(`Would you also like to delete all inventory listings for this warehouse?`)) {
                await inventoryDeleteAllRowsByWarehouseId(deleteBtns[i].value);
            }

            await loadWarehouseInfo();
            
        })
    }
}

async function setWarehouseEdit() {
    let id = editId.innerHTML;
    let name = inputName.value || inputName.placeholder;
    let address = inputAddress.value || inputAddress.placeholder;
    let city = inputCity.value || inputCity.placeholder;
    let province = inputProvince.value || inputProvince.placeholder;
    let postal = inputPostal.value || inputPostal.placeholder;
    let country = inputCountry.value || inputCountry.placeholder;
    await warehouseEditById(id, name, address, city, province, postal, country);

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

    await loadWarehouseInfo();
}

editWarehouseBtn.addEventListener(`click`, setWarehouseEdit);

async function createWarehouse() {
    let check = await warehouseGetById(inputId.value);
    if(!check){
        await warehouseCreate(inputId.value, inputName.value, 
                inputAddress.value, inputCity.value, inputProvince.value, 
                inputPostal.value, inputCountry.value);
        inputId.value = inputName.value = inputAddress.value = ``;
        inputCity.value = inputProvince.value = inputPostal.value = ``;
        inputCountry.value = ``;
        await loadWarehouseInfo();
    } else {
        alert(`Warehouse ID already exists, use a different one.`);
    }
}

createWarehouseBtn.addEventListener(`click`, createWarehouse);