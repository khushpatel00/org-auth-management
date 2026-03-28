require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/database.config')
let server = express();


connectDB();


server.use('/', require('./Routes/index.routes'));

server.listen(process.env.PORT, () => {
    console.log(`Server Running at http://localhost:${process.env.PORT}/`)
})