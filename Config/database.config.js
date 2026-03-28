const mongoose = require('mongoose');

function connection(){
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Established connection with Database'))
        .catch((error) => console.error('\n\nCant Establish connection with Databse, due to, \n' + error)); // reduces extra error message
}

module.exports = connection;