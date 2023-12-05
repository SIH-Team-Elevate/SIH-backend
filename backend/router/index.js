require('dotenv').config();
const express=require('express');
const path=require('path');


const connect=require('../database/mongodb/mongodb_connect.js')
const dumster=require('../database/mongodb/Schema/dumster.js')
const shovel=require('../database/mongodb/Schema/shovel.js')
const hardware=require("./hardware/index.js")
const frontend=require("./frontend/index.js")
// const hyperledger=require("./hyperledger/index.js")


const app=express();


connect();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/hardware',hardware)
app.use('/frontend',frontend)
// app.use('/hyperledger',hyperledger)
app.use(express.static(path.join(__dirname, "../static/build")));
app.listen(process.env.PORT ,()=>{
    console.log("server is running")
})
