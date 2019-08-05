let crypto = require('../Database/Crypto');
let mongo = require('../utils/mongo');
let router = require('express').Router();

// Add user to database
router.post("/user/", async (req, res, next) => {
    let errors = [];
    let initializer = mongo.initialize();

    if (!req.body.password)
        errors.push("No Password specified");
    if (!req.body.email)
        errors.push("No email specified");
    if (errors.length) {
        res.status(400).json({ "errors": errors.join(",") });
        return;
    }

    // User's data
    let data = {
        _id: req.body.email,
        name: req.body.name,
        email: req.body.email,
        password: await crypto.Encrypt(req.body.password)
    };

    // console.log(data)
    await initializer;
    try {
        await mongo.insertOne(data);
        res.json({message:"inserted", data});
    } catch(err) {
        res.status(400).json(err)
    }    
    mongo.destroy();      
});

// Get user by id
router.get("/user/:id", async (req, res, next) => {
    let initializer = mongo.initialize()    

    try {
        await initializer
        let id = req.params.id;
        let users = await mongo.getUserById(id);

        res.json(users);
    } catch(err) {
        res.json({erro: 'erro', err});
    }
    await mongo.destroy();
});

// Get all users from database
router.get("/users", async (req, res, next) => {
    let initializer = mongo.initialize();

    try {
        await initializer;
        let users = await mongo.getAllUsers();
        res.json(users);
    } catch(err) {
        res.json({erro: 'error', err});
    }
    mongo.destroy();
});

// Delete user by id
router.delete("/user/", async (req, res, next) => {
    await mongo.initialize()
    try {
        let commandResult = mongo.deleteUserById(req.body.email)
        if(mongo.HasDeletedUser(commandResult))
            res.json({message: "user not found"})
        else
            res.json({message: "user deleted"})
    } catch(err) {
        res.status(400).json(err)
    }
    mongo.destroy()
})

// UPDATE user by ID, could be by password's hash(crypto.Compare()), for testing purposes it is done this way
router.patch("/user/", async (req, res, next) => {
    let initializer = mongo.initialize()
    let id = req.body.id

    // User's new data
    let data = {        
        name: req.body.name        
    }
    
    try {
        await initializer
        await mongo.UpdateUserdata(id, data)

        res.json({message: "Success"})
    } catch(err) {
        res.json({err, message: "error"})
    }
    await mongo.destroy()
})


module.exports = router;