require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/database.config')
let server = express();


connectDB();
server.use(express.json());
server.use(express.urlencoded());
server.use(express.static('/public'));


server.use('/', require('./Routes/index.routes'));

server.listen(process.env.PORT, () => {
    console.log(`Server Running at http://localhost:${process.env.PORT}/`)
})



/* roles => {
    SUPERADMIN = 7, all privilages
    ADMIN = 6,  limited privilage
    MANAGER = 5, access to manager/employee
    EMPLOYEE = 4 access to employee only
} */