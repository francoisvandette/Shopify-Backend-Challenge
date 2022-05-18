let loadData = document.querySelector(`#load-test-data`);
let deleteData = document.querySelector(`#delete-all-data`);

loadData.addEventListener(`click`, async function() {
    await loadTestData();
    alert(`Test data loaded`);
});

deleteData.addEventListener(`click`, async function() {
    await deleteAllData();
    alert(`All data in the database was deleted.`);
})