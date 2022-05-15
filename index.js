let editBtns;
let deleteBtns;

let inputCode = document.querySelector(`#product-code-input`);
let inputName = document.querySelector(`#product-name-input`);
let inputDesc = document.querySelector(`#product-description-input`);
let inputCateg = document.querySelector(`#product-category-input`);
let createProductBtn = document.querySelector(`#create-product-btn`);
let editProductBtn = document.querySelector(`#edit-product-btn`);
let editProductCodeDisplay = document.querySelector(`#product-code-edit`);

productDisplayAll();

async function productDisplayAll() {
    let productList;


    // getting product list
    await db.collection(`product`).get({ keys: true }).then(product => {
        productList = product;

        let list = document.querySelector(`#product-list`);
        list.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;

        let tableContents = ``;
        for(let i = 0; i < product.length; i++) {
            tableContents += `
                <tr>
                    <td class="pid">${product[i].data.ProductCode}</td>
                    <td>${product[i].data.ProductName}</td>
                    <td>${product[i].data.Description}</td>
                    <td>${product[i].data.Category}</td>
                    <td><span class="quantity"></span></td>
                    <td><button class="edit-btn" value=${product[i].data.ProductCode}>Edit</td>
                    <td><button class="delete-btn" value=${product[i].data.ProductCode}>Delete</td>
                </tr>
                `;
        }

        list.innerHTML = tableContents;

        // grabbing the newly created Edit and Delete buttons
        editBtns = document.querySelectorAll(".edit-btn");
        deleteBtns = document.querySelectorAll(".delete-btn");

        // then getting inventory to match total quantities
        db.collection(`inventory`).get().then(inventory => {
            console.log(inventory);
            let quantitySpans = document.querySelectorAll(`span.quantity`);
            
            // loop through the Product List, getting the id, and searching for entries in the Inventory
            for(let i = 0; i < productList.length; i++) {
                let tempArray = [];
                let tempSum = 0;
                for(let j = 0; j < inventory.length; j++) {
                    if(productList[i].data.ProductCode == inventory[j].ProductCode){
                        tempArray.push(inventory[j].ProductLocationQuantity);
                        tempSum += inventory[j].ProductLocationQuantity;
                    }
                }
                quantitySpans[i].innerHTML = tempSum;
            }
        })
    })

       // adding Table Edit Button functionality
    for(let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener(`click`, function () {
            console.log(`editing:`,editBtns[i].value);
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
            
            // productEdit(editBtns[i].value, )
        })
    }

    // adding Table Delete Button functionality
    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener(`click`, async function () {
            // console.log(`deleting:`,deleteBtns[i].value);
            let con = confirm(`Are you sure you want to delete this product?`);
            if(con) {
                await productDeleteByCode(deleteBtns[i].value);
            }
            if(con && confirm(`Would you also like to delete all inventory listings?`)) {
                await inventoryDeleteAllRowsByProductCode(deleteBtns[i].value);
            }

            await productDisplayAll();
            
        })
    }
}

async function createProduct() {
    let code = inputCode.value.trim();
    let name = inputName.value.trim();
    let desc = inputDesc.value.trim();
    let categ = inputCateg.value.trim();

    // check if product code exists, if no then can create
    productExists(code);

    setTimeout(function() {
        if(!productExistsResult){
            productCreate(code, name, desc, categ);
            setTimeout(function() {
                productDisplayAll();
            }, 10)
            inputCode.value = ``;
            inputName.value = ``;
            inputDesc.value = ``;
            inputCateg.value = ``;
        } else {
            alert(`Product code already exists, use a different one.`)
        }
        
        productExistsResult = false;
    }, 10)

    
}

createProductBtn.addEventListener(`click`, createProduct);

async function setEditProductChanges() {
    let code = editProductCodeDisplay.innerHTML;
    let name = inputName.value;
    let desc = inputDesc.value;
    let categ = inputCateg.value;

    if(inputName.value.trim() == ``){
        name = inputName.placeholder;
    }
    if(inputDesc.value.trim() == ``){
        desc = inputDesc.placeholder;
    }
    if(inputCateg.value.trim() == ``){
        categ = inputCateg.placeholder;
    }

    await productEdit(code, name, desc, categ);
    setTimeout(function(){
        productDisplayAll()
    }, 10);

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

let checkbox = document.querySelector(`#add-inventory-check`);

checkbox.addEventListener(`click`, checked)

function checked() {
    if(checkbox.checked){
        console.log(`checkbox is checked`);
    }
    if(!checkbox.checked){
        console.log(`checkbox NOT checked`);
    }
}