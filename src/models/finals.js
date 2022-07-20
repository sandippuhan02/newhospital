const mongoose = require("mongoose");
const finalsSchema = new mongoose.Schema({
    name:{
        type:String,
       // required:true
    },
   
    email:{
        type:String,
        //required:true,
        //unique:true

    },
    medicine:{
        type:String,
    },
    gender:{
       // type:String
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
    doctor:String,
    department:String
});
module.exports = mongoose.model("finals", finalsSchema);
 