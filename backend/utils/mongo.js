const MongoClient = require('mongodb').MongoClient;
let connection;
let db;

async function initialize() {
    connection = await MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true });
    db = connection.db("users");
}

async function destroy() {
    return connection.close();
}

async function insertOne(user) {
    return db.collection("users").insertOne(user);
}

async function getUserById(_id) {
    return db.collection("users").findOne({_id});
}

async function getAllUsers() {
    return db.collection("users").find({}).toArray();
}

async function deleteUserById(_id) {
    return db.collection("users").deleteOne({_id});
}

async function HasDeletedUser(promise) {
    return await promise.deletedCount == 1
}

async function UpdateUserdata(_id, data) {
    let query = {email: _id};
    let newValues = {$set: data};

    db.collection("users").updateOne(query,newValues);
}

module.exports = { 
    initialize,
    destroy,
    insertOne,
    getUserById,
    getAllUsers,
    deleteUserById,
    HasDeletedUser,
    UpdateUserdata
};