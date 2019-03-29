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
