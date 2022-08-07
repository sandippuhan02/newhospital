let mongoose = require('mongoose');
module.exports = new mongoose.model('pending',{
    name:{
        type:String,
       required:true,
         unique:true

    },
   
    email:{
        type:String,
        required:true,
        unique:true

    },
    gender:{
       
    },
    phone:{
        type:Number,
        required:true,
        
    },
    department:{ },

       
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
    symptom:{},
})