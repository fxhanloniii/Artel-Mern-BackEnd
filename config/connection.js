const mongoose = require('mongoose');
require('dotenv').config();
// This is my actual string in the .env file coming in
const connectionString = process.env.MONGO_DB_URI;


// This connects mongoDB to Mongoose to provide rules for the models
mongoose.connect(connectionString);

// mongoDB connection on success
mongoose.connection.on('connected', () => {
    
})

// mongoDB connection on error
mongoose.connection.on('error', (error) => {
   
})

// disconnecting from mongoDB
mongoose.connection.on('disconnected', () => {
    
})