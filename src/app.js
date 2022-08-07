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
app.get("/doclog", (req, res) => {
    res.render("doclog");
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
            symptom:req.body.symptom,
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
    const department = req.body.dept;
    console.log("form name :" + lname);
    console.log("login form password 1:" + lpassword);
    console.log("login form dept:" + department);

   

    let data1 = await pendingModel.findOne({ email: lname });
    
    let data2 = await registermodel.findOne({ email: lname });
    
    let data3 = await finalsModel.findOne({ email: lname });
    let data4 = await serversModel.findOne({ email: lname });



    if(data1 != null)
    {    
        if(data1.password == lpassword && data1.department == department){
            res.render ("list1",{data1:data1});
        }
    }


    else if(data1 == null && data2!==null)
    
    
    {
        if(data2.password ==  (lpassword) && data2.department == department){
            res.render("list2",{data2:data2});
        }
        else
           res.send("check password in doctor level");
    }

    else if(data1 == null && data2 ==null && data3!== null)
    {
        if(data3.password ==  parseInt(lpassword) && data3.department == department){
           res.render("showdetails",{data3:data3});
        }
        else
           res.send("check password of final data");
    }

    else if(data1 == null && data2 ==null && data3== null && data4!=null)
    {
       
           res.render("sd",{data4:data4});
    }
   
    else {

        res.send("check username");
    }
});



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
     //let doctorData = await doctorsModel.find({department:ldept});
     console.log( "my needy doctors"+doctorData);
   res.render("approve",{pendingData,doctorData});
   
})
/*original data*/
app.post('/registerpatient/patient',async(req,res)=>{
    let patientId = req.query.id;
    let pendingData = await pendingModel.findOne({_id:patientId}); 
    let doctordata = await doctorsModel.findOne({name:req.body.doctors})/*maybe*/
    console.log(doctordata);
    pendingData = {
        
        name : pendingData.name,
        email : pendingData.email,
        gender : pendingData.gender,
        phone : pendingData.phone,
        age : pendingData.age,
        symptom : pendingData.symptom,
        password : pendingData.password,
        department : pendingData.department,
        doctor:doctordata.name,
        demail:doctordata.demail
    }
    let newData = new registermodel(pendingData);
    await newData.save();
    console.log("inserted data :"+newData);
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
app.post("/adminlog/vp",async(req,res)=>{
    await finalsModel.deleteOne({_id:req.body.dischargedata});
    res.redirect('/adminlog/vp');


})


app.get("/doclog",async(req,res)=>{
    if(req.headers.cookie)
    {
       if(req.headers.cookie.includes('doc')){
        let name = req.headers.cookie.split('doc=')[1]
        name = name.replace('%40','@');
        let data = await registermodel.find({demail:name});
        console.log("---------------");
        console.log(name);
        console.log('---------------');
        res.render("showlist",{data:data});
       } 
      
    }
    else{
        res.render('doclog')
    }
});

app.post("/doclog",async (req,res)=>{
    let name = req.body.dname;
    let password = req.body.dpass;
    let data = await registermodel.find({demail:name});
    /*doctor patients*/
    console.log("doctor patients :"+data);
   
    if( data != null)
    {
       if(password === "123"){
           res.cookie('doc',req.body.dname) /*doubt*/
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
    console.log("finalData" +finalData);
    
    finalData = {
        
        name : finalData.name,
        email : finalData.email,
        gender : finalData.gender,
        phone : finalData.phone,
        age : finalData.age,
        symptom : finalData.symptom,
        password : finalData.password,
        department : finalData.department,
        doctor : finalData.doctor,
        demail:finalData.demail, 
        medicine:req.body.medicine
    }

    
    let newData =  new finalsModel(finalData);
    await newData.save();

    console.log("final data is " + newData)
    let serverData =  new serversModel(finalData);
      await serverData.save();
    

     let abc = await registermodel.deleteOne({_id:req.body.presdata});
     res.redirect('/doclog')
     
    
   
    
   
})

app.post('/doclogout',(req,res)=>{
    res.clearCookie('doc');
    res.redirect('/doclog');
})

app.get("/adminlog/pp",(req,res)=>{
    res.render("patientp");
})
app.post("/adminlog/pp",(req,res)=>{
    let name = req.body.pname;
    let pass = req.body.ppass;
    let dept = req.body.dept;
    // c
    // lat data = await serversModel.find({})
    console.log(name);
    console.log(pass);
    console.log(dept);
    res.send(dept);

})


app.get("/doc",(req,res)=>{
    res.send(doctordetails);
})

app.get("/adminlog/add",(req,res)=>{
    res.render("adddoc");
})


app.post("/adminlog/add",async (req,res)=>{

    let adddata={

        name :req.body.dname,
        demail :req.body.demail,
         department :req.body.dept,
    }

    let serverData =  await  doctorsModel(adddata);
   serverData = await serverData.save();
   console.log(serverData);
   res.send(serverData);

   
});

app.post("/adminlog/dltdoc",async (req,res)=>{
    let name = req.body.dname;
   let  email= req.body.email;
    let  department = req.body.dept
    
    let neew = await  doctorsModel.findOne({demail : email}) ; 
    console.log(email);   
    res.send(neew);
     


});



app.get("/doctable",async (req,res)=>{
    let doctorList = await doctorsModel.find();
    console.log(doctorList);
    res.render("doctable",{doctorList:doctorList});
})




/*end of code*/
app.listen(6001, () => {
    console.log("server started on port 6001" );
});