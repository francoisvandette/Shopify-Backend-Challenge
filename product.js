let editBtns;
let deleteBtns;

let inputCode = document.querySelector(`#product-code-input`);
let inputName = document.querySelector(`#product-name-input`);
let inputDesc = document.querySelector(`#product-description-input`);
let inputCateg = document.querySelector(`#product-category-input`);
let createProductBtn = document.querySelector(`#create-product-btn`);
let editProductBtn = document.querySelector(`#edit-product-btn`);
let editProductCodeDisplay = document.querySelector(`#product-code-edit`);
let list = document.querySelector(`#product-list`);

productDisplayAll();

async function productDisplayAll() {
    // retrieve all the products in the database
    let products = await productGetAll();

    // indicate loading in the table for the user, resetting tableContents
    list.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;
    let tableContents = ``;

    // loop to fill table with all the products in the database
    for(let i = 0; i < products.length; i++) {
        tableContents += `
            <tr>
                <td class="pid">${products[i].ProductCode}</td>
                <td>${products[i].ProductName}</td>
                <td>${products[i].Description}</td>
                <td>${products[i].Category}</td>
                <td><span class="quantity"></span></td>
                <td><button class="edit-btn" value=${products[i].ProductCode}>Edit</button></td>
                <td><button class="delete-btn" value=${products[i].ProductCode}>Delete</button></td>
            </tr>
            `;
    }
    list.innerHTML = tableContents;

    // grabbing the newly created Edit and Delete buttons
    editBtns = document.querySelectorAll(".edit-btn");
    deleteBtns = document.querySelectorAll(".delete-btn");

    // then getting inventory to get the total quantities
    await inventoryGetAll().then(inventory => {
        let quantitySpans = document.querySelectorAll(`span.quantity`);
        
        for(let i = 0; i < products.length; i++) {
            let tempSum = 0;
            for(let j = 0; j < inventory.length; j++) {
                if(products[i].ProductCode == inventory[j].ProductCode){
                    tempSum += parseInt(inventory[j].ProductLocationQuantity);
                }
            }
            quantitySpans[i].innerHTML = tempSum;
        }
    })

    // adding Table Edit Button functionality
    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener(`click`, function () {
            // fills the form inputs for the user to edit
            db.collection(`product`).doc({ProductCode: editBtns[i].value}).get().then(product => {
                editProductCodeDisplay.innerHTML = product.ProductCode;
                inputCode.style.display = `none`;
                inputName.value = product.ProductName;
                inputName.placeholder = product.ProductName;
                inputDesc.value = product.Description;
                inputDesc.placeholder = product.Description;
                inputCateg.value = product.Category;
                inputCateg.placeholder = product.Category;
                createProductBtn.style.display = `none`;
                editProductBtn.style.display = `block`;
            })
        })
    }

    // adding Table Delete Button functionality
    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener(`click`, async function () {
            // confirm for the user
            let con = confirm(`Are you sure you want to delete this product?
                \nNote: This will also delete all inventory entries for this product.`);

            if(con) {
                await productDeleteByCode(deleteBtns[i].value);
                await inventoryDeleteAllRowsByProductCode(deleteBtns[i].value);
            }
            // reload the table
            await productDisplayAll();
        })
    }
}

async function createProduct() {
    let code = inputCode.value.trim();
    let name = inputName.value.trim();
    let desc = inputDesc.value.trim();
    let categ = inputCateg.value.trim();

    // check to see if any inputs are blank, exits the function if any are blank
    if(code == `` || name == `` || desc == `` || categ == ``){
        alert(`Please fill the entire form.`);
        return;
    }
    
    // checks to see if a product with that code already exists
    let rowCheck = await productExists(code);
    if(!rowCheck){
        await productCreate(code, name, desc, categ);
        inputCode.value = ``;
        inputName.value = ``;
        inputDesc.value = ``;
        inputCateg.value = ``;
        await productDisplayAll();
    } else {
        alert(`Product code already exists, use a different one.`)
    }
}

createProductBtn.addEventListener(`click`, createProduct);

async function setEditProductChanges() {
    let code = editProductCodeDisplay.innerHTML;
    let name = inputName.value;
    let desc = inputDesc.value;
    let categ = inputCateg.value;

    // checks to see if any of the inputs are blank, uses the placeholder if true
    if(inputName.value.trim() == ``){
        name = inputName.placeholder;
    }
    if(inputDesc.value.trim() == ``){
        desc = inputDesc.placeholder;
    }
    if(inputCateg.value.trim() == ``){
        categ = inputCateg.placeholder;
    }

    // editing the product
    await productEdit(code, name, desc, categ).then(response => {
        // reload the table
        productDisplayAll();
    });

    // resetting the form
    editProductBtn.style.display = `none`;
    createProductBtn.style.display = `block`;
    editProductCodeDisplay.innerHTML = ``;
    inputCode.style.display = `inline`;
    inputCode.value = ``;
    inputCode.placeholder = ``;
    inputName.value = ``;
    inputName.placeholder = ``;
    inputDesc.value = ``;
    inputDesc.placeholder = ``;
    inputCateg.value = ``;
    inputCateg.placeholder = ``;
}

editProductBtn.addEventListener(`click`, setEditProductChanges);