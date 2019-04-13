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
mysqlConnection.connect((err) => {
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
    const query = "INSERT INTO signup(name,email,pw) VALUES ('" + req.body.name + "','" + req.body.email + "','" + req.body.pw + "')";

    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
        } else {
        }
    })
    mysqlConnection.query("SELECT * FROM signup where name=?", [req.body.name], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }

    })
})
app.get("/signup", (req, res) => {
    console.log(req.body)
    const query = "SELECT * FROM signup"
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...", err)
        }
    })
})
app.post("/login", (req, res) => {
    var email = req.body.email
    var pw = req.body.pw
    mysqlConnection.query("SELECT * FROM signup WHERE email = ?", [email], (error, results, fields) => {
        if (error) {
            res.send({
                status: false,
                message: 'there are some error with query'
            })
        }
        else {
            if (results.length > 0) {
                if (pw === results[0].pw) {
                    res.send({
                        status: true,
                        message: 'successfully authenticated',
                        name: results[0].name,
                        iduser: results[0].iduser
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Email and password does not match"
                    });
                }
            }
            else {
                res.json({
                    status: false,
                    message: "Email does not exits"
                });
            }
        }
    });
})

app.post("/boards", (req, res) => {
    const query = "INSERT INTO boards (bTitle,iduser,idteams) VALUES ('" + req.body.bTitle + "'," + req.body.iduser + "," + req.body.idteams + ")";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT idboards,bTitle,idteams FROM boards JOIN signup ON signup.iduser = boards.iduser  WHERE boards.idboards=? AND boards.idteams=0", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)

                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })
})

app.get("/:id/boards", (req, res) => {

    mysqlConnection.query("SELECT * FROM boards JOIN signup ON signup.iduser = boards.iduser  WHERE boards.iduser=? AND boards.idteams=0", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }
    })

})
app.get("/board/:id", (req, res) => {

    mysqlConnection.query("SELECT * FROM boards JOIN signup ON signup.iduser = boards.iduser  WHERE boards.idboards=?", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }
    })

})
app.post("/teams", (req, res) => {
    const query = "INSERT INTO teams (tName,tDesc,iduser) VALUES ('" + req.body.tName + "','" + req.body.tDesc + "'," + req.body.iduser + ")";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT tName,tDesc FROM teams JOIN signup ON signup.iduser = teams.iduser  WHERE teams.idteams=?", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)

                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })
})
app.get("/:id/teams", (req, res) => {

    mysqlConnection.query("SELECT * FROM teams JOIN signup ON signup.iduser = teams.iduser  WHERE teams.iduser=?", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)


        } else {
            console.log("err...", err)
        }
    })
})
app.post("/teamboards", (req, res) => {
    const query = "INSERT INTO boards (bTitle,iduser,idteams) VALUES ('" + req.body.bTitle + "'," + req.body.iduser + "," + req.body.idteams + ")";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT bTitle FROM boards JOIN teams ON teams.idteams = boards.idteams where boards.idteams=?", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)

                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })
})
app.get("/:id/teamboards", (req, res) => {
    mysqlConnection.query("SELECT bTitle FROM boards JOIN teams ON teams.idteams = boards.idteams  WHERE boards.idteams =?", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }
    })

})
app.post("/lists", (req, res) => {
    const query = "INSERT INTO list (lname,iduser,idteams,idboards) VALUES ('" + req.body.lName + "'," + req.body.iduser + "," + req.body.idteams + "," + req.body.idboards + ")";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT lName FROM list   WHERE idlist=?", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)

                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })
})
app.get("/:id/lists", (req, res) => {
    mysqlConnection.query("SELECT * FROM list JOIN boards ON boards.idboards = list.idlist  WHERE list.idboards=? ", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)
            console.log("list", rows)

        } else {
            console.log("err...", err)
        }
    })

})