/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
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

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});