// Get the objects we need to modify
let addDogForm = document.getElementById('add-dog-form-ajax');

// Modify the objects we need
addDogForm.addEventListener("submit", function(e){

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDogName = document.getElementById("input-dogName");
    let inputBreed = document.getElementById("input-breed");
    let inputHealthStatus = document.getElementById("input-healthStatus");
    let inputSex = document.getElementById("input-sex");
    let inputDateOfBirth = document.getElementById("input-dateOfBirth");
    let inputAdopterID = document.getElementById("input-adopterID");

    // Get the values from the form fields
    let dogNameValue = inputDogName.value;
    let breedValue = inputBreed.value;
    let healthStatusValue = inputHealthStatus.value;
    let sexValue = inputSex.value;
    let dateOfBirthValue = inputDateOfBirth.value;
    let adopterIDValue = inputAdopterID.value;  // Nullable if no adopter is selected

    // Put our data we want to send in a JavaScript object
    let data = {
        dogName: dogNameValue,
        breed: breedValue,
        healthStatus: healthStatusValue,
        sex: sexValue,
        dateOfBirth: dateOfBirthValue,
        adopterID: adopterIDValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200){

            // Add the new data to the table
            addRowToDogTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDogName.value = '';
            inputBreed.value = '';
            inputHealthStatus.value = '';
            inputSex.value = '';
            inputDateOfBirth.value = '';
            inputAdopterID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from Dogs
function addRowToDogTable(data) {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dog-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells for each dog attribute
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dogNameCell = document.createElement("TD");
    let breedCell = document.createElement("TD");
    let healthStatusCell = document.createElement("TD");
    let sexCell = document.createElement("TD");
    let dateOfBirthCell = document.createElement("TD");
    let adopterIDCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.dogID;
    dogNameCell.innerText = newRow.dogName;
    breedCell.innerText = newRow.breed;
    healthStatusCell.innerText = newRow.healthStatus;
    sexCell.innerText = newRow.sex;
    dateOfBirthCell.innerText = newRow.dateOfBirth;
    adopterIDCell.innerText = newRow.adopterID || 'None';

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(dogNameCell);
    row.appendChild(breedCell);
    row.appendChild(healthStatusCell);
    row.appendChild(sexCell);
    row.appendChild(dateOfBirthCell);
    row.appendChild(adopterIDCell);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();
}
