// Citation for the following function:
// Date: 08/04/2024
// Adapted Based on:
// Source: URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addAdopterForm = document.getElementById('add-adopter-form-ajax');

// Modify the objects we need
addAdopterForm.addEventListener("submit", function(e){

    //Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-firstName-ajax");
    let inputLastName = document.getElementById("input-lastName-ajax");
    let inputAdopterEmail = document.getElementById("input-adopterEmail-ajax");
    let inputPhoneNumber  = document.getElementById("input-phoneNumber-ajax");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let adopterEmailValue = inputAdopterEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;

    // Put our data we want to send in a javascript object
    let data ={
        firstName: firstNameValue,
        lastName: lastNameValue,
        adopterEmail: adopterEmailValue,
        phoneNumber: phoneNumberValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-adopter-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200){

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputAdopterEmail.value = '';
            inputPhoneNumber.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from Adopters.

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("adopter-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query(last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let adopterEmailCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.adopterID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    adopterEmailCell.innerText = newRow.adopterEmail;
    phoneNumberCell.innerText = newRow.phoneNumber;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAdopter(newRow.id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(adopterEmailCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(deleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();
}