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
            console.log("si", rows)
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
            mysqlConnection.query("SELECT idboards,bTitle,idteams FROM boards JOIN signup ON signup.iduser = boards.iduser  WHERE boards.idboards=? ", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)
                    console.log(result)

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
            mysqlConnection.query("SELECT * FROM teams JOIN signup ON signup.iduser = teams.iduser  WHERE teams.idteams=?", [rows.insertId], (err, result) => {
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
            mysqlConnection.query("SELECT * FROM boards JOIN teams ON teams.idteams = boards.idteams where boards.idteams=?", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)
                    console.log("teamb....", result)

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
    mysqlConnection.query("SELECT * FROM boards JOIN teams ON teams.idteams = boards.idteams  WHERE boards.idteams =?", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }
    })
})
app.put("/:idb/editteamboards/:idt", (req, res) => {

    mysqlConnection.query("UPDATE boards SET idteams=? WHERE idboards=?", [req.params.idt, req.params.idb], (err, result) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM boards WHERE idboards =?", [req.params.idb], (err, rows) => {
                if (!err) {
                    res.send(rows)
                    console.log("EDITED TEAMBOARDS..", rows)

                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })

})
app.post("/lists", (req, res) => {
    const query = "INSERT INTO list (lname,iduser,idteams,idboards) VALUES ('" + req.body.lName + "'," + req.body.iduser + "," + req.body.idteams + "," + req.body.idboards + ")";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM list WHERE idlist=?", [rows.insertId], (err, result) => {
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
    mysqlConnection.query("SELECT * FROM list  WHERE idboards=? ", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }
    })

})
app.get("/:id/alllists", (req, res) => {
    mysqlConnection.query("SELECT * FROM list  WHERE idboards=? ", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)

        } else {
            console.log("err...", err)
        }
    })

})
app.get("/:idu/teamboard/:idb", (req, res) => {
    mysqlConnection.query("SELECT * FROM boards  WHERE iduser =? AND idboards=?", [req.params.idu, req.params.idb], (err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...", err)
        }
    })

})
app.post("/cards", (req, res) => {

    const query = "INSERT INTO cards (cTitle,idlists,idboards,idteams,iduser) VALUES ('" + req.body.cTitle + "'," + req.body.idlists + "," + req.body.idboards + "," + req.body.idteams + "," + req.body.iduser + ") ";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM cards WHERE idcards=?", [rows.insertId], (err, result) => {
                if (!err) {
                    res.send(result)
                    // console.log("...")

                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })

})

app.get("/:idb/cards", (req, res) => {

    mysqlConnection.query("SELECT * FROM cards JOIN list ON list.idlist = cards.idlists  WHERE cards.idboards=? ", [req.params.idb], (err, rows) => {
        if (!err) {
            res.send(rows)
            //console.log("card details....",rows)

        } else {
            console.log("err...", err)
        }
    })

})
app.delete("/:idc/cardsdel", (req, res) => {
    mysqlConnection.query("SELECT * FROM cards WHERE idcards=? AND cards.isArch=1  ", [req.params.idc], (err, rows) => {
        if (!err) {
            if (rows.length > 0) {
                mysqlConnection.query("DELETE  FROM cards WHERE idcards=? AND cards.isArch=1 ", [req.params.idc], (err, rows) => {
                    if (!err) {
                        mysqlConnection.query("DELETE  FROM carddetails WHERE idcards=?   ", [req.params.idc], (err, rows) => {
                            if (!err) {
                                mysqlConnection.query("DELETE  FROM cardcomments WHERE idcards=?  ", [req.params.idc], (err, rows) => {
                                    if (!err) {
                                        res.send(rows)
                                        console.log("deleted")

                                    } else {
                                        console.log("err...", err)
                                    }
                                })

                            } else {
                                console.log("err...", err)
                            }
                        })

                    } else {
                        console.log("err...", err)
                    }
                })
            }
        } else {
            console.log("err...", err)
        }
    })



})

app.put("/:idl/editcards/:idc", (req, res) => {
    mysqlConnection.query("UPDATE cards SET idlists=? WHERE idcards=?", [req.params.idl, req.params.idc], (err, result) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM cards WHERE idcards =?", [req.params.idc], (err, rows) => {
                if (!err) {
                    res.send(rows)
                } else {
                    console.log("err...", err)
                }
            })
        } else {
            console.log("err...", err)
        }
    })
})
app.post("/cardscomment", (req, res) => {

    const query = "INSERT INTO cardcomments (cComment,idcards) VALUES ('" + req.body.cComment + "'," + req.body.idcards + ")";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM cardcomments WHERE idcomm=?", [rows.insertId], (err, result) => {
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
app.post("/cardsdesc", (req, res) => {
    const query = "INSERT INTO carddetails (idcards,cDesc) VALUES (" + req.body.idcards + ",'" + req.body.cDesc + "')";
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM carddetails WHERE idcards=?", [req.body.idcards], (err, result) => {
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

app.get("/:idc/carddetails", (req, res) => {

    mysqlConnection.query("SELECT * FROM carddetails WHERE idcards=? ", [req.params.idc], (err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...", err)
        }
    })

})
app.get("/:idc/cardcomments", (req, res) => {
    mysqlConnection.query("SELECT * FROM cardcomments WHERE idcards=? ", [req.params.idc], (err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...", err)
        }
    })

})
app.post("/cardseditdesc", (req, res) => {
    mysqlConnection.query("UPDATE carddetails SET cDesc=? WHERE idcards=?", [req.body.cDesc, req.body.idcards], (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM carddetails WHERE idcards=?", [req.body.idcards], (err, result) => {
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
app.post("/:id/archivecard", (req, res) => {
    mysqlConnection.query("UPDATE cards SET isArch=1 WHERE idcards=?", [req.params.id], (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM cards WHERE idcards=?", [req.params.id], (err, result) => {
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

app.post("/:id/sendtb", (req, res) => {
    mysqlConnection.query("UPDATE cards SET isArch=0 WHERE idcards=?", [req.params.id], (err, rows) => {
        if (!err) {
            mysqlConnection.query("SELECT * FROM cards WHERE idcards=?", [req.params.id], (err, result) => {
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
app.delete("/:idcom/delcomt", (req, res) => {
    // console.log("...........", req.params.idc)
    mysqlConnection.query("DELETE  FROM cardcomments WHERE idcomm=? ", [req.params.idcom], (err, rows) => {
        if (!err) {
            res.send(req.params.idcom)
        } else {
            console.log("err...", err)
        }
    })

})
app.get("/:idu/allboards", (req, res) => {

    mysqlConnection.query("SELECT * FROM boards where iduser=? ", [req.params.idu], (err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log("err...", err)
        }
    })

})

app.put("/movecard", (req, res) => {
    mysqlConnection.query("SELECT idteams FROM boards WHERE idboards =?", [req.body.idboards], (err, rows) => {
        if (!err) {
            let idteams = rows[0].idteams
            mysqlConnection.query("UPDATE cards SET idboards=?,idteams=?,idlists=? WHERE idcards=?", [req.body.idboards, idteams, req.body.idlist, req.body.idcards], (err, rows) => {
                if (!err) {
                    mysqlConnection.query("SELECT * FROM cards where idcards=? ", [req.body.idcards], (err, rows) => {
                        if (!err) {
                            res.send(rows)
                            console.log("hhh", rows)
                        } else {
                            console.log("err...", err)
                        }
                    })

                } else {
                    console.log("err...", err)
                }
            })

        } else {
            console.log("err...", err)
        }
    })
})
app.post("/duedate", (req, res) => {
    mysqlConnection.query("SELECT * FROM duedate WHERE idcards=?", [req.body.idcards], (err, result) => {
        if (!err) {
            if (result.length == 0) {
                const query = "INSERT INTO duedate (idcards,date,time,reminder) VALUES (" + req.body.idcards + ",'" + req.body.date + "','" + req.body.time + "'," + req.body.reminder + ")";
                mysqlConnection.query(query, (err, rows) => {
                    if (!err) {
                        mysqlConnection.query("SELECT * FROM duedate WHERE idcards=?", [req.body.idcards], (err, result) => {
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
            }
            else {

                mysqlConnection.query("UPDATE duedate SET date=?,time=?,reminder=? WHERE idcards=?", [req.body.date, req.body.time, req.body.reminder, req.body.idcards], (err, rows) => {
                    if (!err) {
                        mysqlConnection.query("SELECT * FROM duedate where idcards=? ", [req.body.idcards], (err, rows) => {
                            if (!err) {
                                res.send(rows)
                                console.log("hhh", rows)
                            } else {
                                console.log("err...", err)
                            }
                        })
    
                    } else {
                        console.log("err...", err)
                    }
                })

            }

        } else {
            console.log("err...", err)
        }
    })


})
app.get("/:id/fetchdd", (req, res) => {
    mysqlConnection.query("SELECT * FROM duedate WHERE idcards=?", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(rows)
            console.log(rows)
        } else {
            console.log("err...", err)
        }
    })
})
app.delete("/:id/deldd", (req, res) => {
    // console.log("...........", req.params.idc)
    mysqlConnection.query("DELETE  FROM duedate WHERE idcards=? ", [req.params.id], (err, rows) => {
        if (!err) {
            res.send(req.params.id)
            console.log("nnn",req.params.id)
        } else {
            console.log("err...", err)
        }
    })

})