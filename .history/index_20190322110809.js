const mysql = require("mysql");
var express = require("express");
var app = express()
var bodypaser = require("body-parser");
app.use(bodypaser.json())
var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "salesmanapi",
    port: '3308'
});
mysqlConnection.connect( (err) => {
    if (!err) {
        console.log("connect successfully")
    } else {
        console.log("conn faild" + JSON.stringify(err, undefined, 2))
    }

});
app.listen(3002, () => {
    console.log("3308 running")
})
// app.get("/signup", (req, res) => {
//     mysqlConnection.query("SELECT * FROM salesman ", (err, rows, field) => {
//         if (!err) {
//             res.send(rows)
//         } else {
//             console.log(err)
//         }
//     })
// })
app.post("/signup", (req, res) => {
    console.log(req.body)
    const query="INSERT INTO signup(name,email,pw) VALUES ('"+req.body.name+"',"+req.body.email+","+req.body.pw+")";
    mysqlConnection.query(query,(err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...",err)
        }
    })
})
