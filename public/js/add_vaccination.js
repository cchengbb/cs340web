// Citation for the following function:
// Date: 08/04/2024
// Adapted Based on:
// Source: URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the form element
let addVaccinationForm = document.getElementById('add-vaccination-form-ajax'); // Ensure this ID matches your form ID

// Add vaccination listener to handle form submission
addVaccinationForm.addEventListener("submit", function (e) {
// Prevent the default form submission behavior
    e.preventDefault();

    // Get form fields
    let inputDogID = document.getElementById("input-dogID-ajax");
    let inputVaccinationType = document.getElementById("input-vaccinationType-ajax");
    let inputVaccinationDate = document.getElementById("input-vaccinationDate-ajax");
        
    // Get the values from the form fields
    let dogIDValue = inputDogID.value;
    let vaccinationTypeValue = inputVaccinationType.value;
    let vaccinationDateValue = inputVaccinationDate.value;
       
    // Get the values from the form fields
    let data = {
        dogID: dogIDValue,
        vaccinationType: vaccinationTypeValue,
        vaccinationDate: vaccinationDateValue
    };

    // Setup the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-vaccination-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what happens on successful data submission
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Add the new vaccination to the table
            addRowToTable(xhttp.response);

            // Clear the input fields after successful submission
            inputDogID.value = '';
            inputVaccinationType.value = '';
            inputVaccinationDate.value = '';
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
    let currentTable = document.getElementById("vaccination-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

 // Create a row and cells for each dog attribute
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dogIDCell = document.createElement("TD");
    let vaccinationTypeCell = document.createElement("TD");
    let vaccinationDateCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.vaccinationID;
    dogIDCell.innerText = newRow.dogID;
    vaccinationTypeCell.innerText = newRow.vaccinationType;
    vaccinationDateCell.innerText = newRow.vaccinationDate;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(dogIDCell);
    row.appendChild(vaccinationTypeCell);
    row.appendChild(vaccinationDateCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();
}
