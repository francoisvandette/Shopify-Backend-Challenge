<h1>Shopify Backend Developer Intern Challenge (Fall 2022)</h1>

https://github.com/francoisvandette/Shopify-Backend-Challenge

<h2>The Project</h2>
  <p>This is an Inventory Management web app where the user can create, update, delete, and view their products, warehouses, and the respective inventory of each product at each location.</p>
  <p>It uses IndexedDB, which is built into all modern browsers, and is a NoSQL type database. A library named "Localbase" is also used in development.</p>
<h3>Link to Localbase</h3>
  <a href="https://github.com/dannyconnell/localbase">https://github.com/dannyconnell/localbase</a>
<h2>How to use this web-app</h2>
<h3>To start:</h3>
  <p>When the user first starts up this web-app, there is no information in the database, and the user is presented with two buttons which are there for the purposes of demonstrating this Inventory Management web-app:
    <ul>
      <li><b>Load Test Data</b> button - which loads some data to demonstrate the functionality of the web-app.</li>
      <li><b>Delete All Data</b> button - which deletes all the data in the database.</li>
    </ul>
    This Inventory management web-app is functional with or without pre-loading any data.
  </p>
<h3>Product Page</h3>
  <p>In the Product Page section, the user is able to create, edit, delete, and view any products that exist in the Product collection/table, along with the total quantities across all warehouse locations. The totals are gathered by accessing the Inventory tables in the database.</p>
  <p><b>To Create a Product</b>, simply fill out the form below the Product Page heading, then click the 'Create Product' button. A new product will be created and the table of Products will reload to display the product. All the inputs for the form must be filled in order to create a product. <b>Note</b>: the Product Code must be unique, so if a duplicate Product Code was entered, then the system will not allow the product to be created.</p>
  <p><b>To Edit or Update an existing Product</b>, click the 'Edit' button in the row of the product you wish to edit. The form that is below the Product Page heading is populated with the information about the product (minus the Product Code) and the user is able to edit the information. When the new/updated information is entered, clicking on the `Edit Product' button will set the changes and reload the table.</p>
  <p><b>To Delete a product</b>, click the 'Delete' button in the row of the product you wish to delete. There will be a pop-up window for the user to confirm the delete. This action will also delete all entries for that product in the Inventory Page.</p>
<h3>Warehouse Page</h3>
  <p>In the Warehouse Page section, the user is able to create, edit, delete, and view a list of their warehouse locations. This is used so that inventory can be assigned to specific locations and tracked.</p>
  <p><b>To Create a Warehouse</b>, simply fill out the form below the Warehouse Page heading, then click the 'Create Warehouse' button. A new warehouse will be created and the table of Warehouses will reloaded to show the addition. All the inputs for the form must be filled in order to create a warehouse. <b>Note</b>: the Warehouse ID must be unique, so if a duplicate Warehouse ID is entered, then the system will not allow the creation of a new warehouse.</p>
  <p><b>To Edit or Update an existing Warehouse</b>, click the 'Edit' button in the row of the warehouse you wish to edit. The form that is below the Warehouse Page heading is populated with the information about the warehouse (minus the Warehouse ID) and the user is able to edit the information. When the new/updated information is entered, clicking on the `Edit Warehouse' button will set the changes and reload the table.</p>
    <p><b>To Delete a Warehouse</b>, click the 'Delete' button in the row of the warehouse you wish to delete. There will be a pop-up window for the user to confirm the delete. This action will also delete all entries for that warehouse in the Inventory Page.</p>
<h3>Inventory Page</h3>
  <p>In the Inventory Page section, the user is able to view each Product / Warehouse combination and the assigned quantity. The Inventory table in the database only tracks the Product Code, the Warehouse ID, and the quantity for the location. It fills the table table with more user-friendly information by retriving the information from the Product and Warehouse tables in the database.</p>
  <p><b>To Create an Inventory entry</b>, use the dropdown menus to select the product and the warehouse, then enter a quantity (currently only uses integer amounts), and click the 'Add Inventory' button at the bottom of the form. The combination of Product Code with Warehouse ID must be unique and an alert is displayed if that combination already exists.</p>
  <p><b>To Edit or Update an existing Inventory entry</b>, click the 'Edit' button in the Inventory row you wish to edit. The form that is below the Inventory Page heading is populated with the information about the inventory line item (the Product and Warehouse dropdown menus are set with the information but disabled so they can not be altered during an edit) and the user is able to edit the quantity for that Product at that Warehouse. When the new/updated information is entered, clicking on the `Edit Inventory' button will set the changes and reload the table.</p>
  <p><b>To Delete an Inventory entry</b>, click the 'Delete' button in the inventory row you wish to delete. There will be a pop-up window for the user to confirm the delete. No changes happen to either the Product or Warehouse tables.</p>
