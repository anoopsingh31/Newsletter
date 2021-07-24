const express = require("express");
const request =require("request");
const https =require("https");
const app =express();

app.use(express.urlencoded({extended: true}));
app.use(express.json())


app.use(express.static("public"))

app.get("/",(req,res)=>
{
    res.sendFile(__dirname+"/signup.htm")
})

app.post("/",(req,res)=>{
     const firstName=req.body.firstName;
     const lastName=req.body.lastName;
     const userEmail=req.body.userEmail;

     const data={
        members:[
            {
                email_address:userEmail,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
     };
     const jsonData =JSON.stringify(data);
     
     const url="https://us6.api.mailchimp.com/3.0/lists/abf757eff5";
     const options={
            method: "POST",
            auth: "anoop:9530c9899bfa64b9ca696bd5fdeb49d5-us6"
     }


     const request=https.request(url,options,function(response)
     {
        console.log(response.statusCode)

        

         response.on("data",function(data)
         {
             const DATA=(JSON.parse(data))
             if( DATA.error_count===1)
             res.sendFile(__dirname+"/email.htm")
             else if(response.statusCode===200 && DATA.error_count===0)
             res.sendFile(__dirname+"/success.htm")
             else
             res.sendFile(__dirname+"/failure.htm")

             console.log(DATA.error_count);
         })
     })
     request.write(jsonData)
     request.end()

})

app.post("/failure",function(req,res)
{
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running on port 3000")
})

//9530c9899bfa64b9ca696bd5fdeb49d5-us6
//abf757eff5