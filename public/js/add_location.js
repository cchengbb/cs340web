// Citation for the following function:
// Date: 08/04/2024
// Adapted Based on:
// Source: URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the form element
let addLocationForm = document.getElementById('add-location-form-ajax'); // Ensure this ID matches your form ID

// Add event listener to handle form submission
addLocationForm.addEventListener("submit", function (e) {
// Prevent the default form submission behavior
    e.preventDefault();

    // Get form fields
    let inputaddress1 = document.getElementById("input-address1-ajax");
    let inputaddress2 = document.getElementById("input-address2-ajax");
    let inputcity = document.getElementById("input-city-ajax");
    let inputstate = document.getElementById("input-state-ajax");
    let inputpostalCode = document.getElementById("input-postalCode-ajax");

    // Get the values from the form fields
    let address1Value = inputaddress1.value;
    let address2Value = inputaddress2.value;
    let cityValue = inputcity.value;
    let stateValue = inputstate.value;
    let postalCodeValue = inputpostalCode.value;
       
    // Get the values from the form fields
    let data = {
        address1: address1Value,
        address2: address2Value,
        city: cityValue,
        state: stateValue,
        postalCode: postalCodeValue
    };

    // Setup the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what happens on successful data submission
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Add the new event to the table
            addRowToTable(xhttp.response);

            // Clear the input fields after successful submission
            inputaddress1.value = '';
            inputaddress2.value = '';
            inputcity.value = '';
            inputstate.value = '';
            inputpostalCode.value = '';
        } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
            console.error("There was an error with the submission.");
            alert('Error: Please check the form fields and try again.');
        }
    };

    // Send the collected data as a JSON string
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the events table
function addRowToTable(data) {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("location-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

 // Create a row and cells for each dog attribute
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let address1Cell = document.createElement("TD");
    let address2Cell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let postalCodeCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.locationID;
    address1Cell.innerText = newRow.address1;
    address2Cell.innerText = newRow.address2;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    postalCodeCell.innerText = newRow.postalCode;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(address1Cell);
    row.appendChild(address2Cell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(postalCodeCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();
}
