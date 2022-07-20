const express = require("express");
const path = require("path");

require("./db/conn")
const static_path = path.join(__dirname, "../public");
const css_path = path.join(__dirname, "../public/css");
const view_path = path.join(__dirname, "../public/views");

console.log("current dir is " + static_path);



const app = express();
const registermodel = require("./models/registers");
const pendingModel = require("./models/pending");
const doctorsModel = require("./models/doctors");
const finalsModel = require("./models/finals");
const serversModel = require("./models/servers");
let isLoggedIn=false;


app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", view_path);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/adminlog", (req, res) => {
    res.render("adminlogform");
});


// inserting new document to our database


app.post("/register", async (req, res) => {

    const password = req.body.inputpassword;
    const cpassword = req.body.inputcnfpassword;
    let a = req.body.dept;
    console.log("dept is"+a);
    
    if (password === cpassword) {
        let data = new pendingModel({
            name: req.body.inputname,
            age: req.body.inputage,
            email: req.body.inputemail,
            phone: req.body.inputphone,
            gender: req.body.gender,
            department:req.body.dept,
            password: req.body.inputpassword,
            confirmpassword: req.body.inputcnfpassword,


        });

        let result = await data.save();
       
        
        res.redirect('/');


    }
    else
        res.send("password not matched");

}
);

// for patient login purpose
app.post("/login", async (req, res) => {
    const lname = req.body.inputname;
    const lpassword = req.body.pass;
    console.log("form name :" + lname);
    console.log("login form password 1:" + lpassword);

    let data = await registermodel.findOne({ name: lname });
    console.log("database password :" + data.password);
    if (data.password === parseInt(lpassword)) {
        console.log("sucess");
        
    }
    else {

        res.send("check password");
    }
})
app.post("/adminlog", (req, res) => {
    let formname = req.body.ainputname;
    let formpassword = req.body.apass;
    if (formname === "sandip" && formpassword === '123') {

        res.render("admin");
    }
    else {
        res.send("error");
    }
})

app.get('/adminlog/request',async(req,res)=>{
    let abc = await pendingModel.find();
   // console.log(abc);
    // res.render('request',{abc:abc})
     res.render('request',{abc:abc}); 
})



/*/dummy database to original*/
app.post('/registers',async(req,res)=>{
    let pendingData = await pendingModel.findOne({_id:req.body.pendingId});  
     let ldept = pendingData.department;
     console.log("dept is :"+ldept);
     let doctorData = await doctorsModel.find({"department":ldept});
     console.log( doctorData);
   res.render("approve",{pendingData,doctorData});
   
})
/*original data*/
app.post('/registerpatient/patient',async(req,res)=>{
    let patientId = req.query.id;
    let pendingData = await pendingModel.findOne({_id:patientId}); 
    pendingData = {
        
        name : pendingData.name,
        email : pendingData.email,
        gender : pendingData.gender,
        phone : pendingData.phone,
        age : pendingData.age,
        password : pendingData.password,
        department : pendingData.department,
        doctor:req.body.doctors
    }
    let newData = new registermodel(pendingData);
    await newData.save();
    await pendingModel.deleteOne({_id:patientId});
    res.redirect('/adminlog/request')
})


app.post('/delete',async (req,res)=>{
    await pendingModel.deleteOne({_id:req.body.pendingId});
    res.redirect('/adminlog/request')
});

/*for admin viewpatient section*/
app.get("/adminlog/vp",async(req,res)=>{
    let data = await finalsModel.find() ;
    res.render("viewpatient",{data:data}); 
})
app.post("adminlog/vp",(req,res)=>{
    // await finalsModel.deleteOne({_id:req.body.dischargedata});
    res.render(req.body.dischargedata);


})

/*doctor page*/
app.get("/doclog",async(req,res)=>{
    if(req.headers.cookie.includes('doc'))
    {
       let name = req.headers.cookie.split('doc=')[1]
       let data = await registermodel.find({doctor:name});
       res.render("showlist",{data:data});  
    }
    else{
        res.render('doclog')
    }
    

})
app.post("/doclog",async (req,res)=>{
    let name = req.body.dname;
    let password = req.body.dpass;
    let data = await registermodel.find({doctor:name});
   
    if( data != null)
    {
       if(password === "123"){
           res.cookie('doc',req.body.dname) 
           res.render("showlist",{data:data});
       }
       else{
        res.send("password not matched");
       }
    }
    else{
        res.send("username not matched");
    }
    


    
   
   

})
app.post("/doclog/:prescribe",async (req,res)=>{
   
   let pdata = await registermodel.findOne({_id:req.query.id})

    res.render("prescribe",{pdata:pdata});
   
});

app.post("/update",async(req,res)=>{
    let finalData = await registermodel.findOne({_id:req.body.presdata});
    
    finalData = {
        
        name : finalData.name,
        email : finalData.email,
        gender : finalData.gender,
        phone : finalData.phone,
        age : finalData.age,
        password : finalData.password,
        department : finalData.department,
        doctor : finalData.doctor,
        medicine:req.body.medicine
    }
    
    let newData =  new finalsModel(finalData);
    await newData.save();
    let serverData =  new serversModel(finalData);
      await serverData.save();
    

     let abc = await registermodel.deleteOne({_id:req.body.presdata});
     res.redirect('/doclog')
     
    
   
    
   
})

app.post('/doclogout',(req,res)=>{
    res.clearCookie('doc');
    res.redirect('/doclog');
})

app.listen(3000, () => {
    console.log("server started on port 3000");
});