// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path:'./env'
})


connectDB()

.then(() =>{
    app.listen(process.env.PORT || 3000, () =>{
        console.log(`Server running on port ${process.env.PORT || 3000}`)
    })
})
.catch((err) => {
    console.log("mongodb connection failed", err);
})