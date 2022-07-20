let express= require("express");
let app = express();
let path = require("path");
let filepath = path.join(__dirname);
console.log(filepath);
const static_path = path.join(__dirname, "./public");
const view_path = path.join(__dirname, "/public/views");
console.log( static_path);
let PORT = process.env.PORT || 8000;

app.use(express.static(static_path));
app.set("view engine","ejs");
 app.set("views",view_path);

app.get("/",(req,res)=>{
    res.render("index1")
});
app.listen(`${PORT}`,()=>{console.log(`sytarted on ${PORT}`)});

