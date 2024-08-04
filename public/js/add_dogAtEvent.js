// Citation for the following function:
// Date: 08/04/2024
// Adapted Based on:
// Source: URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the form element
let addDogAtEventForm = document.getElementById('add-dogAtEvent-form-ajax'); // Ensure this ID matches your form ID

// Add event listener to handle form submission
addDogAtEventForm.addEventListener("submit", function (e) {
// Prevent the default form submission behavior
    e.preventDefault();

    // Get form fields
    let inputDogID = document.getElementById("input-dogID-ajax");
    let inputEventID = document.getElementById("input-eventID-ajax");

    // Get the values from the form fields
    let inputDogIDValue = inputDogID.value;
    let inputEventIDValue = inputEventID.value;
       
    // Get the values from the form fields
    let data = {
        dogID: inputDogIDValue,
        eventID: inputEventIDValue,
    };

    // Setup the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dogAtEvent-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what happens on successful data submission
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Add the new dog at event to the table
            addRowToTable(xhttp.response);

            // Clear the input fields after successful submission
            inputDogID.value = '';
            inputEventID.value = '';

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
    let currentTable = document.getElementById("dogAtEvent-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

 // Create a row and cells for each dog attribute
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dogIDCell = document.createElement("TD");
    let eventIDCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.dogEventID;
    dogIDCell.innerText = newRow.dogID;
    eventIDCell.innerText = newRow.eventID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.dogEventID);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(dogIDCell);
    row.appendChild(eventIDCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("update-dog");
    let option = document.createElement("option");
    option.text = newRow.dogID;
    option.value = newRow.eventID;
    selectMenu.add(option);
    // End of new step 8 code.

}
