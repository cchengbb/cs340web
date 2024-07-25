/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT = 9613;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        let query1 = "SELECT  * FROM Adopters;";

        db.pool.query(query1, function(error, rows, fileds){
            
            res.render('index', {data: rows});
        })  
    });

app.post('/add-adopter-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture Null VALUES
    let adopterEmail = parseInt(data.adopterEmail);
    if (isNaN(adopterEmail))
        {
            adopterEmail = 'NULLL'
        }
    
    let phoneNumber = parseInt(data.phoneNumber);
    if (isNaN(phoneNumber))
        {
            phoneNumber = 'NULL'
        }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Adopters(firstName, lastName, adopterEmail, phoneNumber)
    VALUES ('${data.firstName}', '${data.lastName}', ${adopterEmail}, ${phoneNumber})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if(error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor to an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Adopters
            query2 = `SELECT * FROM Adopters`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if(error){

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })     
});
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});