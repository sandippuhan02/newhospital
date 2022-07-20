let express = require("express");
let app = express();
require("./src/db/conn");
const { application } = require("express");
let doctorsModel = require("./src/models/doctor");
let PORT = process.env.PORT || 8000;

app.get("/",async (req,res)=>{
    let data = await new doctorsModel({
        department:"radiology",
        doctorname:"sks"
    });
    let result = await data.save();
    res.send(result);
});
app.listen(`${PORT}`,()=>console.log("port started on"+PORT));