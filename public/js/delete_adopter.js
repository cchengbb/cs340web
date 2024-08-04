// Citation for the following function:
// Date: 08/04/2024
// Adapted Based on:
// Source: URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteAdopter(adopterID) {
    // Put our data we want to send in a javascript object
    let data = {
        adopterID: adopterID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-adopter-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(adopterID);
            
            // Reload the page to reflect changes
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(adopterID){

    let table = document.getElementById("adopter-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == adopterID) {
            table.deleteRow(i);
            break;
       }
    }
}