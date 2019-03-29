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
app.get("/signup", (req, res) => {
    console.log(req.body)
    const query="SELECT * FROM signup"
    mysqlConnection.query(query,(err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...",err)
        }
    })
})
app.post("/login", (req,res) => {
   
    var email=req.body.email
    var pw=req.body.pw
   console.log("email:",email)
    mysqlConnection.query("SELECT * FROM signup WHERE email = ?",[email], (error, results, fields) => {
            if (error) {
                res.send({
                  status:false,
                  message:'there are some error with query'
                  })
            }
            else
            {
            console.log("len",results)
              if(results.length >0)
              {
                  if(pw===results[0].pw){
                      res.send({
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
app.post("/boards", (req, res) => {
            console.log(req.body)
            const query="INSERT INTO boards (bTitle) VALUES ('"+req.body.bTitle+"')";
            mysqlConnection.query(query,(err, rows) => {
                if (!err) {
                   // console.log("body : ",req.body)
                  //res.send(req.body)
                
                } else {
                    console.log("err...",err)
                }

            })
            const query1="SELECT (idboard,bTitle) FROM boards";
            mysqlConnection.query(query1,(err, rows) => {
                if (!err) {
                   // console.log("body : ",req.body)
                  res.send(req.body)
                
                } else {
                    console.log("err...",err)
                }

            })

        })
app.get("/boards", (req, res) => {
            
            //const query="SELECT bTitle from boards WHERE boardid=?",[body.params.id];
           // const id = req.params.id;
            mysqlConnection.query("SELECT * from boards",(err, rows) => {
                if (!err) {
                    res.send(rows)
                    // console.log("btitle",bTitle)
                } else {
                    console.log("err...",err)
                }
            })
        })
     