const express = require('express');

// creating a express app
const app = express();

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());

const port = process.env.PORT || 3000;


// setting up server on a port 
app.listen(port, (req, res) => {
    console.log("Server started on port: ", port);
});