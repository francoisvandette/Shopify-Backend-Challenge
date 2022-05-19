let loadData = document.querySelector(`#load-test-data`);
let deleteData = document.querySelector(`#delete-all-data`);

loadData.addEventListener(`click`, async function() {
    await loadTestData();
    alert(`Test data loaded`);
    loadData.disabled = true;
});

deleteData.addEventListener(`click`, async function() {
    await deleteAllData();
    alert(`All data in the database was deleted.`);
    loadData.disabled = false;
})