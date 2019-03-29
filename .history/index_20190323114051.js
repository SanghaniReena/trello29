const mysql = require("mysql");
var express = require("express");
var app = express()
var bodypaser = require("body-parser");
const cors = require('cors')
app.use(cors())

app.use(bodypaser.json())
var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "trello",
    port: '3308'
});
mysqlConnection.connect( (err) => {
    if (!err) {
        console.log("connect successfully")
    } else {
        console.log("conn faild" + JSON.stringify(err, undefined, 2))
    }

});
app.listen(3000, () => {
    console.log("3000 running")
})

app.post("/signup", (req, res) => {
    console.log(req.body)
    const query="INSERT INTO signup(name,email,pw) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.pw+"')";
    mysqlConnection.query(query,(err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...",err)
        }
    })
})
app.post("/login", (req) => {
    var email=req.body.email;
    var pw=req.body.pw;
    mysqlConnection.query("SELECT * FROM signup WHERE email = ?,pw=?",[email,pw], (err, rows, field) => {
        if (error) {
            res.json({
              status:false,
              message:'there are some error with query'
              })
        }else{
          if(results.length >0){
              if(pw==results[0].pw){
                  res.json({
                      status:true,
                      message:'successfully authenticated'
                  })
              }else{
                  res.json({
                    status:false,
                    message:"Email and password does not match"
                   });
              }
           
          }
          else{
            res.json({
                status:false,    
              message:"Email does not exits"
            });
          }
        }
      });
    })