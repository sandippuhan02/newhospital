const mongoose = require("mongoose");
const doctorsSchema = new mongoose.Schema({
   department:String,
   demail:String,
   
   name:String,
  
});
module.exports = mongoose.model("doctors", doctorsSchema);
 