const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "./Database/db.sqlite";
const Crypto = require('./Crypto').Encrypt;

const db = new sqlite3.Database(DBSOURCE, err => {
    if(err) {
        console.error(err.message);
    }else {
        // Create table
        console.log("Connected to sqlite database");
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
        )
        `, err => {            
            if(!err) { // Table just created
                // Insert some users
                let insert = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
                db.run(insert, ["admin", "admin@example.com", Crypto("SENHA")]);
                db.run(insert, ["user1", "user1@example.com", Crypto("SENHA")]);
                db.run(insert, ["user2", "user1@example.com", Crypto("SENHA")]);
            }
        })
    }
})

module.exports = db;
