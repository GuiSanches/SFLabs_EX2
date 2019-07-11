const express = require('express');
let app = express();
let db = require('./Database/database');
let crypto = require('./Database/Crypto');

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root path
app.get("/", (req, res, next) => {
    res.json({"message": "Ok"});
});
// Get all users from database
app.get("/api/users", (req, res, next) => {
    let sql = "select * from user";
    let params = [];
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message" : "success",
            "data": rows
        });
    });
});
// Get user by id
app.get("/api/user/:id", (req, res, next) => {
    let sql = "select * from user where id = ?"; //query
    let params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        if(!row)
            row = "User not found, try another id";
        res.json({
            "message": "success",
            "data": row
        });
    });
});
// Add user to database
app.post("/api/user/", (req, res, next) => {
    let errors = [];

    if(!req.body.password) 
        errors.push("No Password specified");
    if(!req.body.email) 
        errors.push("No email specified");
    if(errors.length) {
        res.status(400).json({"errors": errors.join(",")});
        return;
    }
    // User's data
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: crypto.Encrypt(req.body.password)
    }
    let sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    let params = [data.name, data.email, data.password];

    db.run(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        });
    });
});
// UPDATE user by ID, could be by password's hash(crypto.Compare()), for testing purposes it is done this way
app.patch("/api/user/:id", (req, res, next) => {
    // User's data
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? crypto.Encrypt(req.body.password) : undefined
    }
    db.run(
        `UPDATE user set 
            name = COALESCE(?,name), 
            email = COALESCE(?,email), 
            password = COALESCE(?,password) 
            WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data
            })
        });
})
// Delete user by id
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", rows: this.changes })
        });
})

app.use((resp, res) => {
    res.status(404);
});