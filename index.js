const express = require('express');
const { userRouter } = require('./routers/userRouter');
const cookieParser = require('cookie-parser');
const { taskRouter } = require('./routers/taskRouter');

// creating an express app
const app = express();

// database connection
require('./config/db')

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use('/users', userRouter)
app.use('/tasks', taskRouter);

// setting up server on a port 
app.listen(port, (req, res) => {
    console.log("Server started on port: ", port);
});