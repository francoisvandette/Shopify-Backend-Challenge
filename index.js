document.addEventListener(`DOMContentLoaded`, function () {
    fetch(`http://localhost:5000/getAll`)
        .then(response => response.json())
        .then(data => console.log(data));
    loadTableContent([])
});

function loadTableContent(data) {
    const table = document.querySelector(`table tbody`);
    let tableContent = "";
    
    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No Data</td></tr>`;
    }
}