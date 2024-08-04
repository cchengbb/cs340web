// Get the objects we need to modify
let addDogForm = document.getElementById('add-dog-form-ajax');

// Modify the objects we need
addDogForm.addEventListener("submit", function(e){

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDogName = document.getElementById("input-dogName-ajax");
    let inputBreed = document.getElementById("input-breed-ajax");
    let inputHealthStatus = document.getElementById("input-healthStatus-ajax");
    let inputSex = document.getElementById("input-sex-ajax");
    let inputDateOfBirth = document.getElementById("input-dateOfBirth-ajax");
    let inputAdopterID = document.getElementById("input-adopterID-ajax");

    // Get the values from the form fields
    let dogNameValue = inputDogName.value;
    let breedValue = inputBreed.value;
    let healthStatusValue = inputHealthStatus.value;
    let sexValue = inputSex.value;
    let dateOfBirthValue = inputDateOfBirth.value;
    let adopterIDValue = inputAdopterID.value;  
    
    // Ensure adopterID is not empty; if empty, set to null
    if (adopterIDValue.trim() === '') {
        adopterIDValue = 'null';
    }
    else{
        adopterIDValue =`'${adopterIDValue}'`;
    }
    
    // Put our data we want to send in a JavaScript object
    let data = {
        dogName: dogNameValue,
        breed: breedValue,
        healthStatus: healthStatusValue,
        sex: sexValue,
        dateOfBirth: dateOfBirthValue,
        adopterID: adopterIDValue ? adopterIDValue: null
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
addRowToDogTable = (data) =>{
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

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.dogID;
    dogNameCell.innerText = newRow.dogName;
    breedCell.innerText = newRow.breed;
    healthStatusCell.innerText = newRow.healthStatus;
    sexCell.innerText = newRow.sex;
    dateOfBirthCell.innerText = newRow.dateOfBirth;
    adopterIDCell.innerText = newRow.adopterID || '';

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDog(newRow.id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(dogNameCell);
    row.appendChild(breedCell);
    row.appendChild(healthStatusCell);
    row.appendChild(sexCell);
    row.appendChild(dateOfBirthCell);
    row.appendChild(adopterIDCell);
    row.appendChild(deleteCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();

     // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (Dog name, adopterID),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("update-dog");
    let option = document.createElement("option");
    option.text = newRow.dogName;
    option.value = newRow.adopterID;
    selectMenu.add(option);
    // End of new step 8 code.
}
