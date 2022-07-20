const mongoose = require("mongoose");
const registersSchema = new mongoose.Schema({
    name:{
        type:String,
       // required:true
    },
   
    email:{
        type:String,
        //required:true,
        //unique:true

    },
    gender:{
       // type:String
    },
    department:{
        
    },
    phone:{
        type:Number,
       // required:true,
        
    },
    age:{
        type:Number,
       // required:true,
        
    },
    password:{
        type:Number,
        // required:true,

    },
    confirmpassword:{
        type:Number,
        //required:true,

    },
    doctor:String
});
module.exports = mongoose.model("registers", registersSchema)
 