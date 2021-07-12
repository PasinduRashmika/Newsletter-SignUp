//jshint esversion: 6

const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https= require("https");

const app= express();
require('dotenv').config();

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const fname=req.body.Fname;
    const lname=req.body.Lname;
    const email=req.body.email;
    console.log(fname,lname,email); 

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed", 
                merge_fields:{
                FNAME: fname,
                LNAME: lname
                }
            }
        ]

    }

    const jsonData= JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/f852f153fa"; 

    const options={
        method: "POST",
        auth: "PasinduR:"+process.env.KEY
    }
    const request=https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
            
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

   app.post("/failure", function(req, res){
        res.redirect("/");
   });


});

// 
app.listen(process.env.PORT || 3000, function(){
    console.log("This server is running in port 3000");
    //console.log(options.auth);
});



