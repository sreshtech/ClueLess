const mongoose = require('mongoose');
const env = require('./environment');

mongoose.connect(`mongodb://localhost/${env.db}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to mongoDB"));
db.once('open', function(){
    console.log('Connected to database::MongoDB');
});
module.exports = db;