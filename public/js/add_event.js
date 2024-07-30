// Get the form element
let addEventForm = document.getElementById('add-event-form-ajax'); // Ensure this ID matches your form ID

// Add event listener to handle form submission
addEventForm.addEventListener("submit", function (e) {
// Prevent the default form submission behavior
    e.preventDefault();

    // Get form fields
    let inputLocationID = document.getElementById("input-locationID-ajax");
    let inputEventName = document.getElementById("input-eventName-ajax");
    let inputEventDate = document.getElementById("input-eventDate-ajax");
    let inputDescription = document.getElementById("input-description-ajax");
        
    // Get the values from the form fields
    let locationIDValue = inputLocationID.value;
    let eventNameValue = inputEventName.value;
    let eventDateValue = inputEventDate.value;
    let descriptionValue = inputDescription.value;
       
    // Get the values from the form fields
    let data = {
        locationID: locationIDValue,
        eventName: eventNameValue,
        eventDate: eventDateValue,
        description: descriptionValue
    };

    // Setup the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-event-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what happens on successful data submission
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Add the new event to the table
            addRowToTable(xhttp.response);

            // Clear the input fields after successful submission
            inputLocationID.value = '';
            inputEventName.value = '';
            inputEventDate.value = '';
            inputDescription.value = '';
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
    let currentTable = document.getElementById("event-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

 // Create a row and cells for each dog attribute
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let locationIDCell = document.createElement("TD");
    let eventNameCell = document.createElement("TD");
    let eventDateCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.eventID;
    locationIDCell.innerText = newRow.locationID;
    eventNameCell.innerText = newRow.eventName;
    eventDateCell.innerText = newRow.eventDate;
    descriptionCell.innerText = newRow.description;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(locationIDCell);
    row.appendChild(eventNameCell);
    row.appendChild(eventDateCell);
    row.appendChild(descriptionCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    location.reload();
}
