const database = require('../db/database.js');

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
    }
};

module.exports = tickets;
