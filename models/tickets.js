const database = require('../db/database.js');
let mongodb = require('mongodb');
//let ObjectID = require('mongodb').ObjectID;

const tickets = {
    // Get all tickets from db
    getTickets: async function getTickets(req, res){
        var db = await database.openDb();

        //var allTickets = await db.all(`SELECT *, ROWID as id FROM tickets ORDER BY ROWID DESC`);
        const allTickets = await db.collection.find({}).toArray();

        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    // Insert new ticket into db
    // Return created ticket including assigned db id
    createTicket: async function createTicket(req, res){
        var db = await database.openDb();

        const insertResult = await db.collection.insertOne({
            "code": req.body.code,
            "trainnumber": req.body.trainnumber,
            "traindate": req.body.traindate
        });

        await db.client.close();

        return res.json({
            data: {
                id: insertResult.insertedId,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    },

    // update a ticket
    updateTicket: async function updateTicket(req, res){
        var db = await database.openDb();

        await db.collection.updateOne({ _id: new mongodb.ObjectId(req.body._id)}, { $set: { code: req.body.code } });

        await db.client.close();

        return res.json({
            data: {
                id: req.body._id
            }
        });
    },

    // delete a ticket
    deleteTicket: async function deleteTicket(req, res){
        var db = await database.openDb();

        await db.collection.deleteOne({ _id: new mongodb.ObjectId(req.body._id)});

        await db.client.close();

        return res.json({
            data: {
                id: req.body._id
            }
        });
    }
};

module.exports = tickets;
